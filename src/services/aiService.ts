export interface TranscriptionEngine {
  id: string;
  name: string;
  description: string;
  languages: string[];
  accuracy: number;
  speed: number;
  cost: number;
  specialization?: string[];
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

class AIService {
  private engines: TranscriptionEngine[] = [
    {
      id: 'whisper-v3',
      name: 'Whisper V3',
      description: 'OpenAI Whisper - Excellent pour multi-langues',
      languages: ['fr', 'en', 'es', 'it', 'de', 'pt', 'ru', 'ja', 'zh'],
      accuracy: 95,
      speed: 0.5,
      cost: 0.006,
      specialization: ['general', 'education']
    },
    {
      id: 'deepgram',
      name: 'Deepgram Nova',
      description: 'Ultra-rapide, excellent pour l\'anglais',
      languages: ['en', 'es', 'fr', 'de'],
      accuracy: 97,
      speed: 0.1,
      cost: 0.0125,
      specialization: ['business', 'general']
    },
    {
      id: 'medical-ai',
      name: 'MedicalAI Pro',
      description: 'Spécialisé médical avec terminologie',
      languages: ['en', 'fr'],
      accuracy: 99,
      speed: 0.8,
      cost: 0.05,
      specialization: ['medical']
    },
    {
      id: 'legal-ai',
      name: 'LegalTranscribe',
      description: 'Optimisé pour le juridique',
      languages: ['en', 'fr'],
      accuracy: 98,
      speed: 0.7,
      cost: 0.04,
      specialization: ['legal']
    }
  ];

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

  // Transcription simulée
  async transcribe(
    file: File,
    options: TranscriptionOptions
  ): Promise<TranscriptionResult> {
    // Simuler le traitement
    await new Promise(resolve => setTimeout(resolve, 2000));

    const engine = options.engine 
      ? this.engines.find(e => e.id === options.engine)! 
      : this.selectBestEngine(options);

    // Résultat simulé
    const mockSegments: TranscriptionSegment[] = [
      {
        id: '1',
        start: 0,
        end: 5.2,
        text: "Bonjour et bienvenue dans cette présentation sur l'intelligence artificielle.",
        speaker: 'Speaker 1',
        confidence: 0.95
      },
      {
        id: '2',
        start: 5.2,
        end: 12.8,
        text: "Aujourd'hui, nous allons explorer les dernières avancées en matière de transcription automatique.",
        speaker: 'Speaker 1',
        confidence: 0.93
      },
      {
        id: '3',
        start: 13.0,
        end: 18.5,
        text: "Les technologies actuelles permettent une précision remarquable dans de nombreuses langues.",
        speaker: 'Speaker 2',
        confidence: 0.97
      }
    ];

    const result: TranscriptionResult = {
      text: mockSegments.map(s => s.text).join(' '),
      segments: mockSegments,
      metadata: {
        duration: 18.5,
        wordCount: 35,
        accuracy: engine.accuracy,
        engine: engine.name,
        processingTime: 2.1
      }
    };

    // Ajouter résumé si demandé
    if (options.features?.summary) {
      result.summary = "Présentation sur l'IA et les avancées en transcription automatique multilingue.";
    }

    // Ajouter traduction si demandée
    if (options.features?.translation && options.targetLanguage) {
      result.translation = "Hello and welcome to this presentation on artificial intelligence...";
    }

    return result;
  }

  // Agents IA
  async correctText(text: string, language: string): Promise<string> {
    // Simulation de correction
    await new Promise(resolve => setTimeout(resolve, 500));
    return text.replace(/\s+/g, ' ').trim();
  }

  async generateSummary(text: string, maxLength: number = 200): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return "Résumé automatique : " + text.substring(0, maxLength) + "...";
  }

  async suggestImprovements(text: string, sector: string): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      "Suggestion 1 : Utiliser une terminologie plus précise",
      "Suggestion 2 : Ajouter des marqueurs temporels",
      "Suggestion 3 : Vérifier la cohérence des termes techniques"
    ];
  }

  getEngines(): TranscriptionEngine[] {
    return this.engines;
  }
}

export const aiService = new AIService();