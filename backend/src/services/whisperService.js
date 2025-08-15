const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

class WhisperService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/audio';
  }

  async transcribe(filePath, options = {}) {
    try {
      const {
        language = 'auto',
        model = 'whisper-1',
        responseFormat = 'verbose_json',
        temperature = 0,
        prompt = ''
      } = options;

      // Vérifier la taille du fichier (max 25MB pour Whisper)
      const stats = fs.statSync(filePath);
      if (stats.size > 25 * 1024 * 1024) {
        // Si le fichier est trop gros, le diviser
        const chunks = await this.splitAudio(filePath);
        const transcriptions = [];
        
        for (const chunk of chunks) {
          const result = await this.transcribeChunk(chunk, options);
          transcriptions.push(result);
          // Nettoyer le chunk temporaire
          fs.unlinkSync(chunk);
        }
        
        return this.mergeTranscriptions(transcriptions);
      }

      // Transcription directe pour les petits fichiers
      return await this.transcribeChunk(filePath, options);
    } catch (error) {
      console.error('Erreur Whisper transcribe:', error);
      throw new Error('Échec de la transcription');
    }
  }

  async transcribeChunk(filePath, options) {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      formData.append('model', options.model || 'whisper-1');
      
      if (options.language && options.language !== 'auto') {
        formData.append('language', options.language);
      }
      
      if (options.prompt) {
        formData.append('prompt', options.prompt);
      }
      
      formData.append('response_format', options.responseFormat || 'verbose_json');
      formData.append('temperature', options.temperature || 0);

      const response = await axios.post(
        `${this.apiUrl}/transcriptions`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${this.apiKey}`
          },
          maxBodyLength: Infinity
        }
      );

      return this.processResponse(response.data);
    } catch (error) {
      console.error('Erreur transcribeChunk:', error.response?.data || error.message);
      throw error;
    }
  }

  async translate(filePath, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      formData.append('model', 'whisper-1');
      formData.append('response_format', options.responseFormat || 'verbose_json');

      const response = await axios.post(
        `${this.apiUrl}/translations`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return this.processResponse(response.data);
    } catch (error) {
      console.error('Erreur translate:', error);
      throw new Error('Échec de la traduction');
    }
  }

  processResponse(data) {
    if (typeof data === 'string') {
      return {
        text: data,
        language: null,
        duration: null,
        segments: []
      };
    }

    return {
      text: data.text,
      language: data.language,
      duration: data.duration,
      segments: data.segments || [],
      words: data.words || []
    };
  }

  async splitAudio(filePath, chunkDuration = 600) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      const outputDir = path.dirname(filePath);
      const baseName = path.basename(filePath, path.extname(filePath));
      
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        
        const duration = metadata.format.duration;
        const numChunks = Math.ceil(duration / chunkDuration);
        
        const promises = [];
        
        for (let i = 0; i < numChunks; i++) {
          const startTime = i * chunkDuration;
          const outputPath = path.join(outputDir, `${baseName}_chunk_${i}.mp3`);
          chunks.push(outputPath);
          
          promises.push(
            new Promise((resolve, reject) => {
              ffmpeg(filePath)
                .setStartTime(startTime)
                .setDuration(chunkDuration)
                .output(outputPath)
                .audioCodec('mp3')
                .on('end', resolve)
                .on('error', reject)
                .run();
            })
          );
        }
        
        Promise.all(promises)
          .then(() => resolve(chunks))
          .catch(reject);
      });
    });
  }

  mergeTranscriptions(transcriptions) {
    const merged = {
      text: transcriptions.map(t => t.text).join(' '),
      language: transcriptions[0]?.language,
      duration: transcriptions.reduce((sum, t) => sum + (t.duration || 0), 0),
      segments: [],
      words: []
    };

    let timeOffset = 0;
    
    for (const trans of transcriptions) {
      if (trans.segments) {
        for (const segment of trans.segments) {
          merged.segments.push({
            ...segment,
            start: segment.start + timeOffset,
            end: segment.end + timeOffset
          });
        }
      }
      
      if (trans.words) {
        for (const word of trans.words) {
          merged.words.push({
            ...word,
            start: word.start + timeOffset,
            end: word.end + timeOffset
          });
        }
      }
      
      timeOffset += trans.duration || 0;
    }

    return merged;
  }

  async optimizeAudio(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .audioCodec('mp3')
        .audioBitrate('128k')
        .audioChannels(1)
        .audioFrequency(16000)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run();
    });
  }

  detectLanguage(text) {
    // Utiliser une librairie de détection de langue
    // ou l'API de traduction pour détecter
    const langDetect = require('langdetect');
    const detected = langDetect.detect(text);
    return detected.length > 0 ? detected[0].lang : 'unknown';
  }

  async generateSubtitles(transcription, format = 'srt') {
    const { segments } = transcription;
    if (!segments || segments.length === 0) {
      throw new Error('Pas de segments disponibles pour les sous-titres');
    }

    if (format === 'srt') {
      return this.generateSRT(segments);
    } else if (format === 'vtt') {
      return this.generateVTT(segments);
    }

    throw new Error('Format de sous-titres non supporté');
  }

  generateSRT(segments) {
    let srt = '';
    
    segments.forEach((segment, index) => {
      srt += `${index + 1}\n`;
      srt += `${this.formatTime(segment.start, 'srt')} --> ${this.formatTime(segment.end, 'srt')}\n`;
      srt += `${segment.text.trim()}\n\n`;
    });
    
    return srt;
  }

  generateVTT(segments) {
    let vtt = 'WEBVTT\n\n';
    
    segments.forEach((segment, index) => {
      vtt += `${this.formatTime(segment.start, 'vtt')} --> ${this.formatTime(segment.end, 'vtt')}\n`;
      vtt += `${segment.text.trim()}\n\n`;
    });
    
    return vtt;
  }

  formatTime(seconds, format) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    if (format === 'srt') {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
    } else {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
    }
  }
}

module.exports = new WhisperService();