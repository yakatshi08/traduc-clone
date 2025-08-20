// backend/src/controllers/transcriptionController.js
const Transcription = require('../models/Transcription');
const Document = require('../models/Document');
const whisperService = require('../services/whisperService');
const queueService = require('../services/queueService');
const { validationResult } = require('express-validator');

class TranscriptionController {
  /**
   * Créer une nouvelle transcription
   */
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { documentId, settings = {} } = req.body;
      const userId = req.user.id;

      // Vérifier que le document existe et appartient à l'utilisateur
      const document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).json({ error: 'Document non trouvé' });
      }

      if (!document.canEdit(userId)) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      // Vérifier les limites de l'utilisateur
      const user = await req.user;
      if (user.usage.transcriptionMinutes >= user.limits.maxTranscriptionMinutes) {
        return res.status(429).json({ 
          error: 'Limite de transcription atteinte',
          limit: user.limits.maxTranscriptionMinutes,
          used: user.usage.transcriptionMinutes
        });
      }

      // Créer la transcription
      const transcription = new Transcription({
        documentId,
        userId,
        status: 'queued',
        settings: {
          ...settings,
          language: settings.language || document.sourceLanguage || 'fr'
        }
      });

      await transcription.save();

      // Ajouter à la file d'attente
      await queueService.addTranscriptionJob({
        transcriptionId: transcription._id,
        documentId,
        userId,
        priority: user.plan === 'enterprise' ? 'high' : 'normal'
      });

      // Mettre à jour le document
      document.transcriptionId = transcription._id;
      document.status = 'processing';
      await document.save();

      res.status(201).json({
        success: true,
        transcription,
        message: 'Transcription en cours de traitement'
      });

    } catch (error) {
      console.error('Erreur création transcription:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  /**
   * Obtenir une transcription
   */
  async get(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const transcription = await Transcription.findById(id)
        .populate('documentId', 'name type size');

      if (!transcription) {
        return res.status(404).json({ error: 'Transcription non trouvée' });
      }

      // Vérifier les permissions
      const document = await Document.findById(transcription.documentId);
      if (!document.canAccess(userId)) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      res.json({
        success: true,
        transcription
      });

    } catch (error) {
      console.error('Erreur récupération transcription:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  /**
   * Lister les transcriptions de l'utilisateur
   */
  async list(req, res) {
    try {
      const userId = req.user.id;
      const {
        page = 1,
        limit = 20,
        status,
        language,
        documentId,
        sortBy = 'createdAt',
        order = 'desc'
      } = req.query;

      const query = { userId };
      
      if (status) query.status = status;
      if (language) query.language = language;
      if (documentId) query.documentId = documentId;

      const transcriptions = await Transcription.find(query)
        .populate('documentId', 'name type size')
        .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Transcription.countDocuments(query);

      res.json({
        success: true,
        transcriptions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Erreur liste transcriptions:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  /**
   * Mettre à jour une transcription (corrections)
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { text, segments, corrections } = req.body;
      const userId = req.user.id;

      const transcription = await Transcription.findById(id);
      if (!transcription) {
        return res.status(404).json({ error: 'Transcription non trouvée' });
      }

      // Vérifier les permissions
      const document = await Document.findById(transcription.documentId);
      if (!document.canEdit(userId)) {
        return res.status(403).json({ error: 'Modification non autorisée' });
      }

      // Mettre à jour les champs
      if (text) transcription.text = text;
      if (segments) transcription.segments = segments;
      if (corrections) {
        transcription.corrections.push(...corrections.map(c => ({
          ...c,
          correctedBy: userId,
          correctedAt: new Date()
        })));
      }

      transcription.updatedAt = new Date();
      await transcription.save();

      // Recalculer les métriques
      transcription.calculateMetrics();
      await transcription.save();

      res.json({
        success: true,
        transcription,
        message: 'Transcription mise à jour'
      });

    } catch (error) {
      console.error('Erreur mise à jour transcription:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  /**
   * Exporter une transcription
   */
  async export(req, res) {
    try {
      const { id } = req.params;
      const { format = 'txt' } = req.query;
      const userId = req.user.id;

      const transcription = await Transcription.findById(id);
      if (!transcription) {
        return res.status(404).json({ error: 'Transcription non trouvée' });
      }

      // Vérifier les permissions
      const document = await Document.findById(transcription.documentId);
      if (!document.canAccess(userId)) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      // Générer l'export
      const exportData = await transcription.exportFormat(format);
      
      // Définir les headers appropriés
      const contentTypes = {
        'txt': 'text/plain',
        'srt': 'text/plain',
        'vtt': 'text/vtt',
        'json': 'application/json',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'pdf': 'application/pdf'
      };

      res.setHeader('Content-Type', contentTypes[format] || 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="transcription_${id}.${format}"`);
      
      res.send(exportData);

    } catch (error) {
      console.error('Erreur export transcription:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  /**
   * Supprimer une transcription
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const transcription = await Transcription.findById(id);
      if (!transcription) {
        return res.status(404).json({ error: 'Transcription non trouvée' });
      }

      // Vérifier les permissions
      if (transcription.userId.toString() !== userId) {
        return res.status(403).json({ error: 'Suppression non autorisée' });
      }

      // Supprimer la transcription
      await transcription.remove();

      // Mettre à jour le document
      await Document.findByIdAndUpdate(transcription.documentId, {
        $unset: { transcriptionId: 1 },
        status: 'uploaded'
      });

      res.json({
        success: true,
        message: 'Transcription supprimée'
      });

    } catch (error) {
      console.error('Erreur suppression transcription:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  /**
   * Obtenir les statistiques de transcription
   */
  async stats(req, res) {
    try {
      const userId = req.user.id;

      const stats = await Transcription.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            totalWords: { $sum: '$wordCount' },
            totalDuration: { $sum: '$duration' },
            avgAccuracy: { $avg: '$metrics.accuracy' },
            avgWER: { $avg: '$metrics.wer' },
            byStatus: {
              $push: '$status'
            },
            byLanguage: {
              $push: '$language'
            }
          }
        }
      ]);

      res.json({
        success: true,
        stats: stats[0] || {
          total: 0,
          totalWords: 0,
          totalDuration: 0,
          avgAccuracy: 0,
          avgWER: 0
        }
      });

    } catch (error) {
      console.error('Erreur stats transcription:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

module.exports = new TranscriptionController();