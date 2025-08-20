// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'enterprise'],
    default: 'user'
  },
  plan: {
    type: String,
    enum: ['free', 'starter', 'pro', 'enterprise'],
    default: 'free'
  },
  usage: {
    transcriptionMinutes: { type: Number, default: 0 },
    translationCharacters: { type: Number, default: 0 },
    storageUsed: { type: Number, default: 0 }, // en bytes
    apiCalls: { type: Number, default: 0 }
  },
  limits: {
    maxTranscriptionMinutes: { type: Number, default: 120 },
    maxTranslationCharacters: { type: Number, default: 50000 },
    maxStorage: { type: Number, default: 1073741824 }, // 1GB
    maxApiCalls: { type: Number, default: 1000 }
  },
  preferences: {
    language: { type: String, default: 'fr' },
    theme: { type: String, default: 'dark' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: String,
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les recherches
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour générer le JWT
userSchema.methods.generateAuthToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = mongoose.model('User', userSchema);