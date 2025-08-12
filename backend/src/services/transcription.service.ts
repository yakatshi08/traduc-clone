// C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend\src\services\transcription.service.ts
import { PrismaClient, TranscriptionStatus, DocumentType } from '@prisma/client';
import OpenAI from 'openai';
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';
import Bull from 'bull';
import path from 'path';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Configuration OpenAI pour Whisper
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configuration de la queue Bull pour traitement asynchrone
const transcriptionQueue = new Bull('transcription', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD
  }
});

export const transcriptionService = {
  // Créer une transcription
  async createTranscription(documentId: string, userId: string, options: any = {}) {
    // Récupérer le document
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId
      }
    });

    if (!document) {
      throw new Error('Document non trouvé');
    }

    // Vérifier que c'est un fichier audio/vidéo
    if (document.type !== DocumentType.AUDIO && document.type !== DocumentType.VIDEO) {
      throw new Error('Le document doit être un fichier audio ou vidéo');
    }

    // Créer l'entrée de transcription avec le bon statut
    const transcription = await prisma.transcription.create({
      data: {
        status: TranscriptionStatus.PENDING,
        language: options.language || 'fr',
        userId,
        documentId,
        projectId: document.projectId,
        engine: options.engine || 'whisper',
        options: JSON.stringify(options)
      }
    });

    // Ajouter à la queue de traitement
    await transcriptionQueue.add('process', {
      transcriptionId: transcription.id,
      documentId,
      userId,
      options
    });

    return transcription;
  },

  // Traiter la transcription avec Whisper
  async processWithWhisper(transcriptionId: string, filePath: string, options: any = {}) {
    try {
      // Mettre à jour le statut en PROCESSING
      await prisma.transcription.update({
        where: { id: transcriptionId },
        data: { 
          status: TranscriptionStatus.PROCESSING,
          startedAt: new Date()
        }
      });

      let audioFile;
      
      // Si c'est une URL Cloudinary, télécharger temporairement
      if (filePath.startsWith('http')) {
        const response = await axios.get(filePath, { responseType: 'stream' });
        const tempPath = path.join(process.cwd(), 'uploads', 'temp', `${transcriptionId}.mp3`);
        
        // Créer le dossier temp s'il n'existe pas
        await fs.promises.mkdir(path.dirname(tempPath), { recursive: true });
        
        const writer = fs.createWriteStream(tempPath);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
        
        audioFile = fs.createReadStream(tempPath);
      } else {
        // Vérifier que le fichier existe
        try {
          await fs.promises.access(filePath);
          audioFile = fs.createReadStream(filePath);
        } catch (error) {
          throw new Error(`Fichier non trouvé : ${filePath}`);
        }
      }

      // Appeler l'API Whisper d'OpenAI
      const response = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: options.language || 'fr',
        response_format: 'verbose_json',
        timestamp_granularities: ['segment', 'word']
      });

      // Extraire les données de la réponse
      const content = response.text;
      const segments = response.segments || [];
      const words = response.words || [];
      const duration = response.duration || 0;

      // Module Explainable AI - Calcul de confiance
      const confidence = this.calculateConfidence(segments, words);

      // Compter les mots
      const wordCount = content.split(/\s+/).length;

      // Mettre à jour la transcription avec le statut COMPLETED
      const updatedTranscription = await prisma.transcription.update({
        where: { id: transcriptionId },
        data: {
          content,
          segments: segments as any, // Prisma Json type
          words: words as any, // Prisma Json type
          status: TranscriptionStatus.COMPLETED,
          duration: Math.round(duration),
          wordCount,
          accuracy: confidence.overall,
          confidence: confidence as any, // Prisma Json type
          completedAt: new Date()
        }
      });

      // Nettoyer le fichier temporaire si nécessaire
      if (filePath.startsWith('http')) {
        try {
          await fs.promises.unlink(path.join(process.cwd(), 'uploads', 'temp', `${transcriptionId}.mp3`));
        } catch (error) {
          console.error('Erreur lors de la suppression du fichier temporaire:', error);
        }
      }

      return updatedTranscription;

    } catch (error: any) {
      console.error('Erreur Whisper:', error);
      
      // Mettre à jour le statut en FAILED
      await prisma.transcription.update({
        where: { id: transcriptionId },
        data: { 
          status: TranscriptionStatus.FAILED,
          error: error.message || 'Erreur inconnue lors de la transcription',
          completedAt: new Date()
        }
      });

      throw error;
    }
  },

  // Module Explainable AI - Calcul de confiance
  calculateConfidence(segments: any[], words: any[]) {
    let totalConfidence = 0;
    let count = 0;

    // Analyser la confiance par segment
    const segmentConfidences = segments.map(segment => {
      const avgProb = segment.avg_logprob ? Math.exp(segment.avg_logprob) : 0.5;
      const noSpeechProb = segment.no_speech_prob || 0;
      const confidence = avgProb * (1 - noSpeechProb);
      
      totalConfidence += confidence;
      count++;
      
      return {
        start: segment.start,
        end: segment.end,
        text: segment.text,
        confidence: Math.round(confidence * 100)
      };
    });

    // Analyser les mots peu fiables
    const lowConfidenceWords = words
      .filter(w => w.probability && w.probability < 0.7)
      .map(w => ({
        word: w.word,
        probability: w.probability,
        start: w.start,
        end: w.end
      }));

    return {
      overall: count > 0 ? Math.round((totalConfidence / count) * 100) : 0,
      segments: segmentConfidences,
      lowConfidenceWords,
      metrics: {
        avgLogProb: count > 0 ? totalConfidence / count : 0,
        totalSegments: segments.length,
        totalWords: words.length,
        uncertainWords: lowConfidenceWords.length
      }
    };
  },

  // Domain Adaptation - Vocabulaire personnalisé
  async applyDomainAdaptation(transcriptionId: string, domain: string) {
    const vocabularies: Record<string, string[]> = {
      medical: ['diagnostic', 'symptôme', 'pathologie', 'traitement', 'posologie', 'anamnèse', 'pronostic'],
      legal: ['juridiction', 'procédure', 'plaidoirie', 'jurisprudence', 'contentieux', 'requête', 'arrêt'],
      business: ['ROI', 'KPI', 'benchmark', 'stakeholder', 'roadmap', 'revenue', 'EBITDA'],
      education: ['pédagogie', 'curriculum', 'évaluation', 'compétence', 'didactique', 'syllabus']
    };

    const customVocab = vocabularies[domain] || [];
    
    // Appliquer le vocabulaire personnalisé pour améliorer la précision
    // Cette fonctionnalité sera étendue avec un modèle fine-tuné
    
    // Pour l'instant, on peut utiliser ce vocabulaire pour post-traiter
    // et corriger certains mots mal transcrits
    if (customVocab.length > 0 && transcriptionId) {
      const transcription = await prisma.transcription.findUnique({
        where: { id: transcriptionId }
      });
      
      if (transcription && transcription.content) {
        // Logique de correction basée sur le vocabulaire personnalisé
        // À implémenter selon les besoins spécifiques
      }
    }
    
    return customVocab;
  },

  // QA Post-Transcription - Détection d'erreurs
  async performQualityAssurance(transcriptionId: string) {
    const transcription = await prisma.transcription.findUnique({
      where: { id: transcriptionId }
    });

    if (!transcription || !transcription.content) {
      return null;
    }

    const content = transcription.content;
    const issues: any[] = [];

    // Détection des nombres mal transcrits
    const numberPatterns = /\d+[.,]?\d*/g;
    const numbers = content.match(numberPatterns) || [];
    
    // Détection des unités incohérentes
    const unitPatterns = /(km|m|cm|mm|kg|g|mg|L|ml|€|\$|£|%)/gi;
    const units = content.match(unitPatterns) || [];

    // Détection des entités mal formées
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = content.match(emailPattern) || [];
    
    // Détection des URLs
    const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const urls = content.match(urlPattern) || [];

    // Vérifier la cohérence
    if (numbers.length > 0) {
      issues.push({
        type: 'numbers',
        count: numbers.length,
        samples: numbers.slice(0, 5),
        suggestion: 'Vérifier l\'exactitude des nombres transcrits'
      });
    }

    if (units.length > 0) {
      issues.push({
        type: 'units',
        count: units.length,
        samples: units.slice(0, 5),
        suggestion: 'Contrôler la cohérence des unités de mesure'
      });
    }

    if (emails.length > 0) {
      issues.push({
        type: 'emails',
        count: emails.length,
        samples: emails.slice(0, 3),
        suggestion: 'Vérifier le format des adresses email'
      });
    }

    if (urls.length > 0) {
      issues.push({
        type: 'urls',
        count: urls.length,
        samples: urls.slice(0, 3),
        suggestion: 'Vérifier la validité des URLs'
      });
    }

    // Analyser la ponctuation
    const sentenceEndPattern = /[.!?]/g;
    const sentences = content.split(sentenceEndPattern).filter(s => s.trim().length > 0);
    
    if (sentences.length < 2 && content.length > 100) {
      issues.push({
        type: 'punctuation',
        suggestion: 'La ponctuation semble manquante ou incorrecte'
      });
    }

    return {
      hasIssues: issues.length > 0,
      issues,
      suggestions: this.generateSuggestions(issues),
      stats: {
        totalWords: content.split(/\s+/).length,
        totalSentences: sentences.length,
        avgWordsPerSentence: sentences.length > 0 
          ? Math.round(content.split(/\s+/).length / sentences.length) 
          : 0
      }
    };
  },

  // Générer des suggestions d'amélioration
  generateSuggestions(issues: any[]) {
    const suggestions = new Set<string>();
    
    issues.forEach(issue => {
      if (issue.suggestion) {
        suggestions.add(issue.suggestion);
      }
    });

    // Ajouter des suggestions générales
    if (issues.length > 2) {
      suggestions.add('Considérer une révision manuelle complète du document');
    }

    return Array.from(suggestions);
  },

  // Annuler une transcription
  async cancelTranscription(transcriptionId: string, userId: string) {
    const transcription = await prisma.transcription.findFirst({
      where: {
        id: transcriptionId,
        userId,
        status: {
          in: [TranscriptionStatus.PENDING, TranscriptionStatus.PROCESSING]
        }
      }
    });

    if (!transcription) {
      throw new Error('Transcription non trouvée ou déjà terminée');
    }

    // Annuler le job dans la queue si en attente
    if (transcription.status === TranscriptionStatus.PENDING) {
      const jobs = await transcriptionQueue.getJobs(['waiting', 'delayed']);
      const job = jobs.find(j => j.data.transcriptionId === transcriptionId);
      if (job) {
        await job.remove();
      }
    }

    // Mettre à jour le statut
    return await prisma.transcription.update({
      where: { id: transcriptionId },
      data: {
        status: TranscriptionStatus.CANCELLED,
        completedAt: new Date()
      }
    });
  },

  // Live Captioning (base pour future implémentation)
  async startLiveTranscription(streamUrl: string, userId: string) {
    // Configuration pour transcription en temps réel
    // À implémenter avec WebRTC/WebSocket
    return {
      sessionId: crypto.randomUUID(),
      status: 'connecting',
      streamUrl,
      message: 'Live captioning sera implémenté dans une future version'
    };
  }
};

// Configuration du worker de la queue
transcriptionQueue.process('process', async (job) => {
  const { transcriptionId, documentId, userId, options } = job.data;
  
  try {
    // Récupérer le document
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      throw new Error('Document non trouvé');
    }

    // Traiter avec Whisper
    return await transcriptionService.processWithWhisper(
      transcriptionId,
      document.path,
      options
    );
  } catch (error) {
    console.error(`Erreur lors du traitement de la transcription ${transcriptionId}:`, error);
    throw error;
  }
});

// Gestion des événements de la queue
transcriptionQueue.on('completed', (job, result) => {
  console.log(`✅ Transcription ${job.data.transcriptionId} terminée`);
});

transcriptionQueue.on('failed', (job, err) => {
  console.error(`❌ Transcription ${job.data.transcriptionId} échouée:`, err);
});

transcriptionQueue.on('stalled', (job) => {
  console.warn(`⚠️ Transcription ${job.data.transcriptionId} bloquée`);
});

export default transcriptionService;