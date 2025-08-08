/**
 * TraducXion JavaScript SDK
 * Version: 1.0.0
 */

class TraducXionSDK {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'https://api.traducxion.com/v1';
    this.timeout = options.timeout || 30000;
  }

  /**
   * Headers communs pour toutes les requêtes
   */
  get headers() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'X-SDK-Version': '1.0.0',
      'X-SDK-Language': 'JavaScript'
    };
  }

  /**
   * Transcription d'un fichier audio/vidéo
   */
  async transcribe(file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Ajouter les options
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    const response = await fetch(`${this.baseUrl}/transcribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Transcription depuis une URL
   */
  async transcribeFromUrl(url, options = {}) {
    const response = await fetch(`${this.baseUrl}/transcribe/url`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        url,
        ...options
      })
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Obtenir le statut d'une transcription
   */
  async getTranscriptionStatus(transcriptionId) {
    const response = await fetch(`${this.baseUrl}/transcriptions/${transcriptionId}`, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to get status: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Traduire un texte
   */
  async translate(text, targetLanguage, options = {}) {
    const response = await fetch(`${this.baseUrl}/translate`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        text,
        target_language: targetLanguage,
        ...options
      })
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Générer un résumé
   */
  async summarize(text, options = {}) {
    const response = await fetch(`${this.baseUrl}/summarize`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        text,
        ...options
      })
    });

    if (!response.ok) {
      throw new Error(`Summarization failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Corrections sectorielles
   */
  async correctText(text, sector, language) {
    const response = await fetch(`${this.baseUrl}/correct`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        text,
        sector,
        language
      })
    });

    if (!response.ok) {
      throw new Error(`Correction failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Lister les transcriptions
   */
  async listTranscriptions(options = {}) {
    const params = new URLSearchParams(options);
    const response = await fetch(`${this.baseUrl}/transcriptions?${params}`, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to list transcriptions: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Supprimer une transcription
   */
  async deleteTranscription(transcriptionId) {
    const response = await fetch(`${this.baseUrl}/transcriptions/${transcriptionId}`, {
      method: 'DELETE',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to delete transcription: ${response.statusText}`);
    }

    return { success: true };
  }

  /**
   * Webhooks
   */
  async registerWebhook(event, url) {
    const response = await fetch(`${this.baseUrl}/webhooks`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        event,
        url
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to register webhook: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Obtenir les informations d'utilisation
   */
  async getUsage() {
    const response = await fetch(`${this.baseUrl}/usage`, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to get usage: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export pour Node.js et navigateur
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TraducXionSDK;
} else if (typeof window !== 'undefined') {
  window.TraducXionSDK = TraducXionSDK;
}