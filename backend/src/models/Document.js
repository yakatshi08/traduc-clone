// backend/src/models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  originalName: String,
  type: {
    type: String,
    enum: ['audio', 'video', 'document', 'pdf', 'docx', 'txt', 'srt', 'vtt'],
    required: true
  },
  mimeType: String,
  size: {
    type: Number,
    required: true
  },
  duration: Number, // Pour audio/vidéo en secondes
  pages: Number, // Pour documents
  
  // Stockage
  storageUrl: String,
  storagePath: String,
  thumbnailUrl: String,
  
  // Métadonnées
  metadata: {
    width: Number,
    height: Number,
    bitrate: Number,
    sampleRate: Number,
    channels: Number,
    codec: String,
    format: String
  },
  
  // Statut
  status: {
    type: String,
    enum: ['uploading', 'uploaded', 'processing', 'transcribed', 'translated', 'error', 'ready'],
    default: 'uploading'
  },
  error: String,
  
  // Langues
  sourceLanguage: {
    type: String,
    default: 'auto'
  },
  targetLanguages: [String],
  
  // Transcription
  transcriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transcription'
  },
  
  // Traductions
  translations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Translation'
  }],
  
  // Secteur/Domaine
  sector: {
    type: String,
    enum: ['medical', 'legal', 'business', 'education', 'media', 'general'],
    default: 'general'
  },
  
  // Tags et recherche
  tags: [String],
  searchableText: String,
  
  // Partage
  isPublic: { type: Boolean, default: false },
  sharedWith: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permission: { type: String, enum: ['view', 'edit', 'admin'], default: 'view' },
    sharedAt: { type: Date, default: Date.now }
  }],
  shareToken: String,
  
  // Versions
  version: { type: Number, default: 1 },
  versions: [{
    version: Number,
    createdAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changes: String,
    fileUrl: String
  }],
  
  // Statistiques
  stats: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  
  // Favoris
  starred: { type: Boolean, default: false },
  
  // Dates
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastAccessedAt: Date,
  deletedAt: Date
});

// Index pour les recherches
documentSchema.index({ userId: 1, createdAt: -1 });
documentSchema.index({ projectId: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ searchableText: 'text' });
documentSchema.index({ 'sharedWith.userId': 1 });

// Méthodes
documentSchema.methods.canAccess = function(userId) {
  return this.userId.toString() === userId.toString() ||
         this.isPublic ||
         this.sharedWith.some(share => share.userId.toString() === userId.toString());
};

documentSchema.methods.canEdit = function(userId) {
  if (this.userId.toString() === userId.toString()) return true;
  
  const share = this.sharedWith.find(s => s.userId.toString() === userId.toString());
  return share && (share.permission === 'edit' || share.permission === 'admin');
};

module.exports = mongoose.model('Document', documentSchema);