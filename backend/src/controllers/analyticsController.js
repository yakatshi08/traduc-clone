const { PrismaClient } = require('@prisma/client');
const redis = require('../config/redis');

const prisma = new PrismaClient();

class AnalyticsController {
  // Dashboard général
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;
      const { period = 'week' } = req.query;

      // Essayer de récupérer depuis le cache
      const cacheKey = `analytics:dashboard:${userId}:${period}`;
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        return res.json({
          success: true,
          data: JSON.parse(cached),
          cached: true
        });
      }

      // Calculer les dates
      const now = new Date();
      const startDate = this.getStartDate(period);

      // Récupérer les stats globales
      const [
        projectsCount,
        documentsCount,
        transcriptionsCount,
        totalDuration,
        storageUsed
      ] = await Promise.all([
        prisma.project.count({
          where: { userId }
        }),
        prisma.document.count({
          where: {
            project: { userId }
          }
        }),
        prisma.transcription.count({
          where: {
            document: {
              project: { userId }
            }
          }
        }),
        prisma.transcription.aggregate({
          where: {
            document: {
              project: { userId }
            }
          },
          _sum: {
            duration: true
          }
        }),
        prisma.document.aggregate({
          where: {
            project: { userId }
          },
          _sum: {
            size: true
          }
        })
      ]);

      // Récupérer les tendances
      const trends = await this.getTrends(userId, startDate, period);
      
      // Récupérer les langues
      const languages = await this.getLanguageStats(userId, startDate);
      
      // Récupérer les projets actifs
      const activeProjects = await prisma.project.findMany({
        where: {
          userId,
          status: 'ACTIVE'
        },
        include: {
          _count: {
            select: {
              documents: true
            }
          }
        },
        take: 5,
        orderBy: { updatedAt: 'desc' }
      });

      const data = {
        overview: {
          projectsCount,
          documentsCount,
          transcriptionsCount,
          totalDuration: totalDuration._sum.duration || 0,
          storageUsed: storageUsed._sum.size || 0,
          period
        },
        trends,
        languages,
        activeProjects: activeProjects.map(p => ({
          id: p.id,
          name: p.name,
          documentsCount: p._count.documents,
          lastActivity: p.updatedAt
        }))
      };

      // Mettre en cache pour 5 minutes
      await redis.setex(cacheKey, 300, JSON.stringify(data));

      res.json({
        success: true,
        data,
        cached: false
      });
    } catch (error) {
      console.error('Erreur getDashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des analytics'
      });
    }
  }

  // Statistiques détaillées
  async getDetailedStats(req, res) {
    try {
      const userId = req.user.id;
      const { startDate, endDate, projectId } = req.query;

      const where = {
        document: {
          project: {
            userId
          }
        }
      };

      if (projectId) {
        where.document.projectId = projectId;
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const [
        transcriptions,
        avgConfidence,
        avgDuration,
        languageDistribution,
        hourlyDistribution
      ] = await Promise.all([
        prisma.transcription.findMany({
          where,
          include: {
            document: {
              select: {
                name: true,
                type: true,
                project: {
                  select: {
                    name: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 100
        }),
        prisma.transcription.aggregate({
          where,
          _avg: {
            confidence: true
          }
        }),
        prisma.transcription.aggregate({
          where,
          _avg: {
            duration: true
          }
        }),
        prisma.$queryRaw`
          SELECT language, COUNT(*) as count
          FROM "Transcription" t
          JOIN "Document" d ON t."documentId" = d.id
          JOIN "Project" p ON d."projectId" = p.id
          WHERE p."userId" = ${userId}
          GROUP BY language
        `,
        prisma.$queryRaw`
          SELECT EXTRACT(HOUR FROM "createdAt") as hour, COUNT(*) as count
          FROM "Transcription" t
          JOIN "Document" d ON t."documentId" = d.id
          JOIN "Project" p ON d."projectId" = p.id
          WHERE p."userId" = ${userId}
          GROUP BY hour
          ORDER BY hour
        `
      ]);

      res.json({
        success: true,
        data: {
          transcriptions: transcriptions.map(t => ({
            id: t.id,
            documentName: t.document.name,
            projectName: t.document.project.name,
            language: t.language,
            duration: t.duration,
            confidence: t.confidence,
            createdAt: t.createdAt
          })),
          averages: {
            confidence: avgConfidence._avg.confidence || 0,
            duration: avgDuration._avg.duration || 0
          },
          distributions: {
            languages: languageDistribution,
            hourly: hourlyDistribution
          }
        }
      });
    } catch (error) {
      console.error('Erreur getDetailedStats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      });
    }
  }

  // Export des données
  async exportData(req, res) {
    try {
      const userId = req.user.id;
      const { format = 'json', startDate, endDate } = req.query;

      const where = {
        project: {
          userId
        }
      };

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const documents = await prisma.document.findMany({
        where,
        include: {
          project: true,
          transcriptions: true
        }
      });

      if (format === 'csv') {
        const csv = this.convertToCSV(documents);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=export-${Date.now()}.csv`);
        res.send(csv);
      } else {
        res.json({
          success: true,
          data: documents
        });
      }
    } catch (error) {
      console.error('Erreur exportData:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'export des données'
      });
    }
  }

  // Helpers
  getStartDate(period) {
    const now = new Date();
    switch (period) {
      case 'day':
        return new Date(now.setDate(now.getDate() - 1));
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setDate(now.getDate() - 7));
    }
  }

  async getTrends(userId, startDate, period) {
    const groupBy = period === 'day' ? 'hour' : 'day';
    
    const query = `
      SELECT 
        DATE_TRUNC('${groupBy}', t."createdAt") as date,
        COUNT(*) as transcriptions,
        SUM(t.duration) as duration,
        AVG(t.confidence) as accuracy
      FROM "Transcription" t
      JOIN "Document" d ON t."documentId" = d.id
      JOIN "Project" p ON d."projectId" = p.id
      WHERE p."userId" = $1 AND t."createdAt" >= $2
      GROUP BY date
      ORDER BY date
    `;
    
    const trends = await prisma.$queryRawUnsafe(query, userId, startDate);
    
    return trends.map(t => ({
      date: t.date,
      transcriptions: parseInt(t.transcriptions),
      duration: parseInt(t.duration || 0),
      accuracy: parseFloat(t.accuracy || 0)
    }));
  }

  async getLanguageStats(userId, startDate) {
    const languages = await prisma.$queryRaw`
      SELECT 
        t.language,
        COUNT(*) as count,
        SUM(t.duration) as total_duration
      FROM "Transcription" t
      JOIN "Document" d ON t."documentId" = d.id
      JOIN "Project" p ON d."projectId" = p.id
      WHERE p."userId" = ${userId} AND t."createdAt" >= ${startDate}
      GROUP BY t.language
      ORDER BY count DESC
      LIMIT 10
    `;

    const total = languages.reduce((sum, l) => sum + parseInt(l.count), 0);

    return languages.map(l => ({
      language: l.language,
      count: parseInt(l.count),
      percentage: (parseInt(l.count) / total) * 100,
      duration: parseInt(l.total_duration || 0)
    }));
  }

  convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = ['Project', 'Document', 'Type', 'Size', 'Created', 'Transcriptions'];
    const rows = data.map(d => [
      d.project.name,
      d.name,
      d.type,
      d.size,
      d.createdAt,
      d.transcriptions.length
    ]);
    
    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }
}

module.exports = new AnalyticsController();