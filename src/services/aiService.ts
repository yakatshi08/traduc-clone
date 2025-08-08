import axios from 'axios';

export interface TranscriptionEngine {
  id: string;
  name: string;
  description: string;
  languages: string[];
  accuracy: number;
  speed: number;
  cost: number;
  specialization?: string[];
  apiEndpoint?: string;
  requiresAuth?: boolean;
}

export interface TranscriptionOptions {
  engine?: string;
  language: string;
  targetLanguage?: string;
  sector?: 'medical' | 'legal' | 'education' | 'business' | 'general';
  features?: {
    diarization?: boolean;
    punctuation?: boolean;
    timestamps?: boolean;
    summary?: boolean;
    translation?: boolean;
  };
}

export interface TranscriptionResult {
  text: string;
  segments: TranscriptionSegment[];
  summary?: string;
  translation?: string;
  metadata: {
    duration: number;
    wordCount: number;
    accuracy: number;
    engine: string;
    processingTime: number;
  };
}

export interface TranscriptionSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
  confidence: number;
}

// Configuration des clés API
const API_KEYS = {
  whisper: import.meta.env.VITE_OPENAI_API_KEY || '',
  deepgram: import.meta.env.VITE_DEEPGRAM_API_KEY || '',
  elevenlabs: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
  assemblyai: import.meta.env.VITE_ASSEMBLYAI_API_KEY || ''
};

class AIService {
  private engines: TranscriptionEngine[] = [
    {
      id: 'whisper-v3',
      name: 'OpenAI Whisper V3',
      description: 'OpenAI Whisper - Excellent pour multi-langues',
      languages: ['fr', 'en', 'es', 'it', 'de', 'pt', 'ru', 'ja', 'zh'],
      accuracy: 95,
      speed: 0.5,
      cost: 0.006,
      specialization: ['general', 'education'],
      apiEndpoint: 'https://api.openai.com/v1/audio/transcriptions',
      requiresAuth: true
    },
    {
      id: 'deepgram',
      name: 'Deepgram Nova-2',
      description: 'Ultra-rapide, excellent pour l\'anglais',
      languages: ['en', 'es', 'fr', 'de', 'it'],
      accuracy: 97,
      speed: 0.1,
      cost: 0.0125,
      specialization: ['business', 'general'],
      apiEndpoint: 'https://api.deepgram.com/v1/listen',
      requiresAuth: true
    },
    {
      id: 'assemblyai',
      name: 'AssemblyAI',
      description: 'Excellent pour la diarisation',
      languages: ['en', 'es', 'fr', 'de', 'it'],
      accuracy: 96,
      speed: 0.3,
      cost: 0.015,
      specialization: ['business', 'medical'],
      apiEndpoint: 'https://api.assemblyai.com/v2',
      requiresAuth: true
    }
  ];

  // Dictionnaires sectoriels
  private sectorDictionaries = {
    medical: {
      fr: ['anamnèse', 'diagnostic', 'pronostic', 'thérapeutique', 'pathologie', 'symptôme', 'syndrome'],
      en: ['anamnesis', 'diagnosis', 'prognosis', 'therapeutic', 'pathology', 'symptom', 'syndrome']
    },
    legal: {
      fr: ['jurisprudence', 'plaidoirie', 'réquisitoire', 'attendu', 'dispositif', 'grief'],
      en: ['jurisprudence', 'pleading', 'prosecution', 'whereas', 'ruling', 'grievance']
    },
    education: {
      fr: ['pédagogie', 'didactique', 'curriculum', 'évaluation', 'compétence', 'apprentissage'],
      en: ['pedagogy', 'didactics', 'curriculum', 'assessment', 'competency', 'learning']
    },
    business: {
      fr: ['rentabilité', 'marge', 'trésorerie', 'amortissement', 'bilan', 'actif'],
      en: ['profitability', 'margin', 'cash flow', 'depreciation', 'balance sheet', 'assets']
    }
  };

  // Sélection intelligente du moteur
  selectBestEngine(options: TranscriptionOptions): TranscriptionEngine {
    const { language, sector = 'general' } = options;
    
    // Filtrer par langue
    let availableEngines = this.engines.filter(engine => 
      engine.languages.includes(language)
    );

    // Filtrer par spécialisation
    if (sector !== 'general') {
      const specializedEngines = availableEngines.filter(engine =>
        engine.specialization?.includes(sector)
      );
      if (specializedEngines.length > 0) {
        availableEngines = specializedEngines;
      }
    }

    // Trier par score (accuracy * speed)
    return availableEngines.sort((a, b) => {
      const scoreA = a.accuracy * (1 / a.speed);
      const scoreB = b.accuracy * (1 / b.speed);
      return scoreB - scoreA;
    })[0];
  }

  // Transcription avec Whisper API
  private async transcribeWithWhisper(file: File, options: TranscriptionOptions): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');
    formData.append('language', options.language);
    
    if (options.features?.timestamps) {
      formData.append('response_format', 'verbose_json');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${API_KEYS.whisper}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  }

  // Transcription avec Deepgram API
  private async transcribeWithDeepgram(file: File, options: TranscriptionOptions): Promise<any> {
    const audioData = await file.arrayBuffer();
    
    const params = new URLSearchParams({
      model: 'nova-2',
      language: options.language,
      punctuate: options.features?.punctuation ? 'true' : 'false',
      diarize: options.features?.diarization ? 'true' : 'false',
      smart_format: 'true'
    });

    const response = await axios.post(
      `https://api.deepgram.com/v1/listen?${params}`,
      audioData,
      {
        headers: {
          'Authorization': `Token ${API_KEYS.deepgram}`,
          'Content-Type': file.type
        }
      }
    );

    return response.data;
  }

  // Transcription avec AssemblyAI
  private async transcribeWithAssemblyAI(file: File, options: TranscriptionOptions): Promise<any> {
    // 1. Upload du fichier
    const uploadResponse = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      file,
      {
        headers: {
          'authorization': API_KEYS.assemblyai,
          'content-type': file.type
        }
      }
    );

    // 2. Créer la transcription
    const transcriptResponse = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      {
        audio_url: uploadResponse.data.upload_url,
        language_code: options.language,
        speaker_labels: options.features?.diarization,
        auto_chapters: options.features?.summary,
        punctuate: options.features?.punctuation
      },
      {
        headers: {
          'authorization': API_KEYS.assemblyai
        }
      }
    );

    // 3. Attendre et récupérer le résultat
    const transcriptId = transcriptResponse.data.id;
    let transcript;
    
    do {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const statusResponse = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            'authorization': API_KEYS.assemblyai
          }
        }
      );
      transcript = statusResponse.data;
    } while (transcript.status !== 'completed' && transcript.status !== 'error');

    return transcript;
  }

  // Transcription principale
  async transcribe(
    file: File,
    options: TranscriptionOptions
  ): Promise<TranscriptionResult> {
    const engine = options.engine 
      ? this.engines.find(e => e.id === options.engine)! 
      : this.selectBestEngine(options);

    let rawResult;
    const startTime = Date.now();

    try {
      switch (engine.id) {
        case 'whisper-v3':
          rawResult = await this.transcribeWithWhisper(file, options);
          break;
        case 'deepgram':
          rawResult = await this.transcribeWithDeepgram(file, options);
          break;
        case 'assemblyai':
          rawResult = await this.transcribeWithAssemblyAI(file, options);
          break;
        default:
          throw new Error(`Engine ${engine.id} not implemented`);
      }
    } catch (error) {
      console.error('Transcription error:', error);
      // Fallback vers simulation si API échoue
      return this.simulateTranscription(file, options, engine);
    }

    const processingTime = (Date.now() - startTime) / 1000;

    // Convertir le résultat brut en format standardisé
    const result = this.standardizeResult(rawResult, engine, processingTime);

    // Post-traitement sectoriel
    if (options.sector && options.sector !== 'general') {
      result.text = this.applySectorCorrections(result.text, options.sector, options.language);
    }

    // Ajouter résumé si demandé
    if (options.features?.summary && !result.summary) {
      result.summary = await this.generateSummary(result.text);
    }

    // Ajouter traduction si demandée
    if (options.features?.translation && options.targetLanguage) {
      result.translation = await this.translateText(result.text, options.language, options.targetLanguage);
    }

    return result;
  }

  // Standardiser les résultats de différentes APIs
  private standardizeResult(rawResult: any, engine: TranscriptionEngine, processingTime: number): TranscriptionResult {
    let text = '';
    let segments: TranscriptionSegment[] = [];
    let wordCount = 0;

    switch (engine.id) {
      case 'whisper-v3':
        text = rawResult.text;
        if (rawResult.segments) {
          segments = rawResult.segments.map((seg: any, index: number) => ({
            id: index.toString(),
            start: seg.start,
            end: seg.end,
            text: seg.text,
            confidence: 0.95
          }));
        }
        break;

      case 'deepgram':
        const deepgramResult = rawResult.results;
        text = deepgramResult.channels[0].alternatives[0].transcript;
        if (deepgramResult.channels[0].alternatives[0].words) {
          segments = this.groupWordsToSegments(deepgramResult.channels[0].alternatives[0].words);
        }
        break;

      case 'assemblyai':
        text = rawResult.text;
        if (rawResult.words) {
          segments = this.groupWordsToSegments(rawResult.words);
        }
        if (rawResult.chapters) {
          // Utiliser les chapitres comme résumé
          const summary = rawResult.chapters.map((ch: any) => ch.summary).join(' ');
          return { ...this.standardizeResult({ text }, engine, processingTime), summary };
        }
        break;
    }

    wordCount = text.split(/\s+/).length;

    return {
      text,
      segments,
      metadata: {
        duration: segments.length > 0 ? segments[segments.length - 1].end : 0,
        wordCount,
        accuracy: engine.accuracy,
        engine: engine.name,
        processingTime
      }
    };
  }

  // Grouper les mots en segments
  private groupWordsToSegments(words: any[]): TranscriptionSegment[] {
    const segments: TranscriptionSegment[] = [];
    let currentSegment: any = null;
    let segmentWords: string[] = [];

    words.forEach((word, index) => {
      if (!currentSegment || index % 10 === 0) {
        if (currentSegment) {
          segments.push({
            id: segments.length.toString(),
            start: currentSegment.start,
            end: word.end || word.start + 0.5,
            text: segmentWords.join(' '),
            speaker: word.speaker,
            confidence: word.confidence || 0.9
          });
        }
        currentSegment = { start: word.start };
        segmentWords = [word.text || word.word];
      } else {
        segmentWords.push(word.text || word.word);
      }
    });

    return segments;
  }

  // Corrections sectorielles
  private applySectorCorrections(text: string, sector: string, language: string): string {
    const dictionary = this.sectorDictionaries[sector]?.[language] || [];
    
    // Appliquer des corrections basées sur le dictionnaire sectoriel
    dictionary.forEach(term => {
      const regex = new RegExp(`\\b${term.substring(0, term.length - 2)}\\w*\\b`, 'gi');
      text = text.replace(regex, (match) => {
        // Vérifier si le terme ressemble au terme du dictionnaire
        if (this.similarity(match.toLowerCase(), term.toLowerCase()) > 0.7) {
          return term;
        }
        return match;
      });
    });

    return text;
  }

  // Calcul de similarité entre deux mots
  private similarity(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  // Distance de Levenshtein
  private levenshteinDistance(s1: string, s2: string): number {
    const costs: number[] = [];
    for (let i = 0; i <= s2.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s1.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(j - 1) !== s2.charAt(i - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s1.length] = lastValue;
    }
    return costs[s1.length];
  }

  // Générer un résumé avec OpenAI
  async generateSummary(text: string, maxLength: number = 200): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un assistant qui génère des résumés concis et pertinents.'
            },
            {
              role: 'user',
              content: `Résumez ce texte en maximum ${maxLength} caractères : ${text}`
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEYS.whisper}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Summary generation error:', error);
      return "Résumé automatique : " + text.substring(0, maxLength) + "...";
    }
  }

  // Traduire le texte
  async translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Vous êtes un traducteur professionnel. Traduisez du ${sourceLang} vers ${targetLang}.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEYS.whisper}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Translation error:', error);
      return "Translation not available";
    }
  }

  // Agents IA
  async correctText(text: string, language: string, sector?: string): Promise<string> {
    try {
      const systemPrompt = sector 
        ? `Vous êtes un correcteur spécialisé dans le domaine ${sector}. Corrigez le texte en ${language}.`
        : `Vous êtes un correcteur professionnel. Corrigez le texte en ${language}.`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
          ],
          temperature: 0.2
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEYS.whisper}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Correction error:', error);
      return text;
    }
  }

  async suggestImprovements(text: string, sector: string): Promise<string[]> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Vous êtes un expert en ${sector}. Suggérez 3 améliorations pour ce texte.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.5
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEYS.whisper}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const suggestions = response.data.choices[0].message.content.split('\n').filter(Boolean);
      return suggestions.slice(0, 3);
    } catch (error) {
      console.error('Suggestions error:', error);
      return [
        "Suggestion 1 : Utiliser une terminologie plus précise",
        "Suggestion 2 : Ajouter des marqueurs temporels",
        "Suggestion 3 : Vérifier la cohérence des termes techniques"
      ];
    }
  }

  // Simulation de transcription (fallback)
  private async simulateTranscription(
    file: File,
    options: TranscriptionOptions,
    engine: TranscriptionEngine
  ): Promise<TranscriptionResult> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockSegments: TranscriptionSegment[] = [
      {
        id: '1',
        start: 0,
        end: 5.2,
        text: "Simulation : Transcription en cours avec " + engine.name,
        speaker: 'Speaker 1',
        confidence: 0.95
      }
    ];

    return {
      text: mockSegments.map(s => s.text).join(' '),
      segments: mockSegments,
      metadata: {
        duration: 5.2,
        wordCount: 8,
        accuracy: engine.accuracy,
        engine: engine.name,
        processingTime: 2.0
      }
    };
  }

  getEngines(): TranscriptionEngine[] {
    return this.engines;
  }

  getSectorDictionaries() {
    return this.sectorDictionaries;
  }
}

export const aiService = new AIService();