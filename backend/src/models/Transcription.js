// backend/src/models/Transcription.js
const mongoose = require('mongoose');

const transcriptionSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Contenu
  text: {
    type: String,
    required: true
  },
  segments: [{
    id: String,
    start: Number, // Temps en secondes
    end: Number,
    text: String,
    speaker: String,
    confidence: Number,
    words: [{
      word: String,
      start: Number,
      end: Number,
      confidence: Number
    }]
  }],
  
  // Métadonnées
  language: {
    type: String,
    required: true
  },
  duration: Number,
  wordCount: Number,
  
  // Modèle IA utilisé
  aiModel: {
    type: String,
    default: 'whisper-large-v3'
  },
  aiProvider: {
    type: String,
    enum: ['openai', 'whisper', 'google', 'azure', 'custom'],
    default: 'whisper'
  },
  
  // Métriques de qualité
  metrics: {
    accuracy: Number, // 0-100
    confidence: Number, // 0-1
    wer: Number, // Word Error Rate
    cer: Number, // Character Error Rate
    processingTime: Number // en ms
  },
  
  // Paramètres de transcription
  settings: {
    language: String,
    task: { type: String, enum: ['transcribe', 'translate'], default: 'transcribe' },
    temperature: { type: Number, default: 0 },
    timestampGranularities: [String],
    responseFormat: String,
    prompt: String,
    vadFilter: { type: Boolean, default: true },
    wordTimestamps: { type: Boolean, default: true },
    punctuate: { type: Boolean, default: true },
    speakerDiarization: { type: Boolean, default: false },
    maxSpeakers: Number
  },
  
  // Corrections et révisions
  corrections: [{
    originalText: String,
    correctedText: String,
    position: { start: Number, end: Number },
    correctedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    correctedAt: Date,
    reason: String
  }],
  
  // État
  status: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'queued'
  },
  error: String,
  
  // Export
  exports: [{
    format: { type: String, enum: ['srt', 'vtt', 'txt', 'json', 'docx', 'pdf'] },
    url: String,
    createdAt: Date
  }],
  
  // Timestamps
  startedAt: Date,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index
transcriptionSchema.index({ documentId: 1 });
transcriptionSchema.index({ userId: 1 });
transcriptionSchema.index({ status: 1 });
transcriptionSchema.index({ language: 1 });
transcriptionSchema.index({ text: 'text' });

// Méthodes
transcriptionSchema.methods.calculateMetrics = function() {
  // Calcul du nombre de mots
  this.wordCount = this.text.split(/\s+/).length;
  
  // Calcul de la durée totale
  if (this.segments && this.segments.length > 0) {
    const lastSegment = this.segments[this.segments.length - 1];
    this.duration = lastSegment.end;
  }
};

transcriptionSchema.methods.exportFormat = async function(format) {
  switch(format) {
    case 'srt':
      return this.exportToSRT();
    case 'vtt':
      return this.exportToVTT();
    case 'txt':
      return this.text;
    case 'json':
      return JSON.stringify(this.segments, null, 2);
    default:
      throw new Error(`Format ${format} non supporté`);
  }
};

transcriptionSchema.methods.exportToSRT = function() {
  return this.segments.map((segment, index) => {
    const startTime = this.formatTime(segment.start);
    const endTime = this.formatTime(segment.end);
    return `${index + 1}\n${startTime} --> ${endTime}\n${segment.text}\n`;
  }).join('\n');
};

transcriptionSchema.methods.exportToVTT = function() {
  const vtt = ['WEBVTT\n'];
  this.segments.forEach((segment, index) => {
    const startTime = this.formatTime(segment.start);
    const endTime = this.formatTime(segment.end);
    vtt.push(`${index + 1}\n${startTime} --> ${endTime}\n${segment.text}\n`);
  });
  return vtt.join('\n');
};

transcriptionSchema.methods.formatTime = function(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
};

module.exports = mongoose.model('Transcription', transcriptionSchema);