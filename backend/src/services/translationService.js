// backend/src/services/translationService.js
const { Translate } = require('@google-cloud/translate').v2;
const { OpenAI } = require('openai');
const { getRedisClient } = require('../config/redis');

class TranslationService {
  constructor() {
    // Google Translate
    this.googleTranslate = new Translate({
      key: process.env.GOOGLE_TRANSLATE_API_KEY
    });
    
    // OpenAI GPT pour traductions contextuelles
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.redis = getRedisClient();
    
    // Modèles spécialisés par secteur
    this.sectorPrompts = {
      medical: "Vous êtes un traducteur médical expert. Traduisez en conservant la terminologie médicale précise.",
      legal: "Vous êtes un traducteur juridique expert. Traduisez en conservant la précision juridique.",
      business: "Vous êtes un traducteur business expert. Adaptez le ton professionnel.",
      education: "Vous êtes un traducteur pédagogique. Traduisez de manière claire et accessible.",
      media: "Vous êtes un traducteur média. Conservez le style et le ton appropriés."
    };
  }

  /**
   * Traduire un texte
   */
  async translate(text, targetLanguage, options = {}) {
    try {
      const {
        sourceLanguage = 'auto',
        provider = 'google',
        sector = 'general',
        preserveFormatting = true
      } = options;

      console.log(`🌍 Traduction ${sourceLanguage} → ${targetLanguage} (${provider})`);

      // Vérifier le cache
      const cached = await this.getCachedTranslation(text, targetLanguage);
      if (cached) {
        console.log('✅ Traduction trouvée dans le cache');
        return cached;
      }

      let translation;
      
      switch (provider) {
        case 'google':
          translation = await this.googleTranslation(text, targetLanguage, sourceLanguage);
          break;
        case 'openai':
          translation = await this.openaiTranslation(text, targetLanguage, sourceLanguage, sector);
          break;
        case 'hybrid':
          // Utiliser Google pour la traduction de base et OpenAI pour l'amélioration
          const baseTranslation = await this.googleTranslation(text, targetLanguage, sourceLanguage);
          translation = await this.enhanceTranslation(baseTranslation.text, targetLanguage, sector);
          break;
        default:
          translation = await this.googleTranslation(text, targetLanguage, sourceLanguage);
      }

      // Mettre en cache
      await this.cacheTranslation(text, targetLanguage, translation);

      return translation;
      
    } catch (error) {
      console.error('❌ Erreur de traduction:', error);
      throw new Error(`Erreur de traduction: ${error.message}`);
    }
  }

  /**
   * Traduction avec Google Translate
   */
  async googleTranslation(text, targetLanguage, sourceLanguage = 'auto') {
    const [translation] = await this.googleTranslate.translate(text, {
      from: sourceLanguage === 'auto' ? undefined : sourceLanguage,
      to: targetLanguage
    });

    return {
      text: translation,
      provider: 'google',
      sourceLanguage: sourceLanguage === 'auto' ? await this.detectLanguage(text) : sourceLanguage,
      targetLanguage,
      confidence: 0.95 // Google Translate a généralement une bonne confiance
    };
  }

  /**
   * Traduction avec OpenAI GPT
   */
  async openaiTranslation(text, targetLanguage, sourceLanguage, sector) {
    const languageNames = {
      fr: 'français',
      en: 'anglais',
      es: 'espagnol',
      de: 'allemand',
      it: 'italien'
    };

    const systemPrompt = this.sectorPrompts[sector] || 
      "Vous êtes un traducteur professionnel expert.";

    const userPrompt = `Traduisez le texte suivant du ${languageNames[sourceLanguage] || sourceLanguage} vers le ${languageNames[targetLanguage]}. 
    Conservez le formatage, le ton et le style. 
    
    Texte à traduire:
    ${text}`;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: Math.min(text.length * 2, 4000)
    });

    return {
      text: completion.choices[0].message.content.trim(),
      provider: 'openai',
      model: 'gpt-4-turbo-preview',
      sourceLanguage,
      targetLanguage,
      sector,
      confidence: 0.98
    };
  }

  /**
   * Amélioration de traduction avec GPT
   */
  async enhanceTranslation(translation, targetLanguage, sector) {
    const systemPrompt = this.sectorPrompts[sector] || 
      "Vous êtes un expert en amélioration de traductions.";

    const userPrompt = `Améliorez cette traduction en ${targetLanguage} pour qu'elle soit plus naturelle et fluide, 
    tout en conservant le sens exact:
    
    ${translation}`;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3
    });

    return {
      text: completion.choices[0].message.content.trim(),
      provider: 'hybrid',
      sourceTranslation: translation,
      sector,
      confidence: 0.96
    };
  }

  /**
   * Traduction par segments (pour les transcriptions)
   */
  async translateSegments(segments, targetLanguage, options = {}) {
    console.log(`📝 Traduction de ${segments.length} segments...`);
    
    const translatedSegments = [];
    
    for (const segment of segments) {
      const translation = await this.translate(
        segment.text,
        targetLanguage,
        options
      );
      
      translatedSegments.push({
        ...segment,
        originalText: segment.text,
        text: translation.text,
        targetLanguage
      });
      
      // Petit délai pour éviter le rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return translatedSegments;
  }

  /**
   * Détection de langue
   */
  async detectLanguage(text) {
    try {
      const [detection] = await this.googleTranslate.detect(text);
      return detection.language;
    } catch (error) {
      console.error('Erreur détection langue:', error);
      return 'unknown';
    }
  }

  /**
   * Traduction batch (plusieurs textes)
   */
  async translateBatch(texts, targetLanguage, options = {}) {
    const translations = [];
    
    for (const text of texts) {
      const translation = await this.translate(text, targetLanguage, options);
      translations.push(translation);
    }
    
    return translations;
  }

  /**
   * Cache Redis
   */
  async cacheTranslation(text, targetLanguage, translation) {
    const key = `translation:${targetLanguage}:${Buffer.from(text).toString('base64').substring(0, 50)}`;
    await this.redis.setex(
      key,
      86400, // 24 heures
      JSON.stringify(translation)
    );
  }

  async getCachedTranslation(text, targetLanguage) {
    const key = `translation:${targetLanguage}:${Buffer.from(text).toString('base64').substring(0, 50)}`;
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * Validation de la qualité de traduction
   */
  async validateTranslationQuality(original, translated, options = {}) {
    // Implémentation future avec BLEU score ou autre métrique
    // Pour l'instant, retourner une estimation basique
    
    const originalWords = original.split(/\s+/).length;
    const translatedWords = translated.split(/\s+/).length;
    
    // Ratio de longueur (les traductions ont généralement une longueur similaire)
    const lengthRatio = Math.min(originalWords, translatedWords) / 
                       Math.max(originalWords, translatedWords);
    
    return {
      quality: lengthRatio > 0.7 ? 'good' : 'review_needed',
      lengthRatio,
      confidence: lengthRatio
    };
  }
}

module.exports = new TranslationService();