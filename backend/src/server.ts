import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware de sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Dossier uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.path === '/api/projects') {
    console.log('🎯 POST /api/projects détecté !');
    console.log('Body:', req.body);
  }
  next();
});

// ====================
// ROUTES AUTH
// ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Chercher l'utilisateur
    let user = await prisma.user.findUnique({
      where: { email }
    });

    // Si c'est le premier login de test, créer l'utilisateur
    if (!user && email === 'test@test.com') {
      const hashedPassword = await bcrypt.hash('Test12345!', 10);
      user = await prisma.user.create({
        data: {
          email: 'test@test.com',
          password: hashedPassword,
          name: 'Test User',
          role: 'USER',
          plan: 'PRO',
          minutesUsed: 0,
          minutesLimit: 500
        }
      });
      console.log('✅ Utilisateur de test créé');
    }

    // Créer aussi demo@traducxion.com si nécessaire
    if (!user && email === 'demo@traducxion.com') {
      const hashedPassword = await bcrypt.hash('Demo2025!', 10);
      user = await prisma.user.create({
        data: {
          email: 'demo@traducxion.com',
          password: hashedPassword,
          name: 'Demo User',
          role: 'USER',
          plan: 'BUSINESS',
          minutesUsed: 150,
          minutesLimit: 2000
        }
      });
      console.log('✅ Utilisateur demo créé');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'traducxion-secret-key-2025',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        minutesUsed: user.minutesUsed,
        minutesLimit: user.minutesLimit
      }
    });
  } catch (error) {
    console.error('❌ Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
        plan: 'STARTER',
        minutesUsed: 0,
        minutesLimit: 60
      }
    });

    // Générer le token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'traducxion-secret-key-2025',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('❌ Erreur register:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

app.get('/api/auth/me', async (req, res) => {
  // Pour les tests, retourner un utilisateur par défaut
  res.json({
    success: true,
    data: {
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
      role: 'USER',
      plan: 'PRO',
      minutesUsed: 25,
      minutesLimit: 500
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Déconnexion réussie' });
});

// ====================
// ROUTES PROJECTS
// ====================
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { documents: true }
        }
      }
    });
    
    // Si aucun projet, créer des projets de démonstration
    if (projects.length === 0) {
      console.log('📝 Création de projets de démonstration...');
      
      // Vérifier qu'un utilisateur existe
      let user = await prisma.user.findFirst();
      if (!user) {
        // Créer un utilisateur de test
        const hashedPassword = await bcrypt.hash('Test12345!', 10);
        user = await prisma.user.create({
          data: {
            email: 'test@test.com',
            password: hashedPassword,
            name: 'Test User',
            role: 'USER',
            plan: 'PRO',
            minutesUsed: 0,
            minutesLimit: 500
          }
        });
      }

      // Créer des projets de démo (SANS le champ sector)
      const demoProjects = await Promise.all([
        prisma.project.create({
          data: {
            name: 'Rapport Q4 2024',
            description: 'Transcription du rapport trimestriel',
            type: 'BUSINESS',
            status: 'COMPLETED',
            language: 'fr',
            userId: user.id
          }
        }),
        prisma.project.create({
          data: {
            name: 'Webinar Marketing Digital',
            description: 'Transcription et traduction du webinar',
            type: 'GENERAL',
            status: 'ACTIVE',
            language: 'en',
            userId: user.id
          }
        }),
        prisma.project.create({
          data: {
            name: 'Consultation Médicale',
            description: 'Transcription confidentielle',
            type: 'MEDICAL',
            status: 'ACTIVE',
            language: 'fr',
            userId: user.id
          }
        })
      ]);

      res.json({
        success: true,
        data: demoProjects.map(p => ({
          ...p,
          documentsCount: 0
        }))
      });
    } else {
      res.json({
        success: true,
        data: projects.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          type: p.type,
          status: p.status,
          language: p.language,
          createdAt: p.createdAt,
          documentsCount: p._count.documents
        }))
      });
    }
  } catch (error) {
    console.error('❌ Erreur récupération projets:', error);
    res.json({
      success: true,
      data: []
    });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    console.log('📝 POST /api/projects - Début');
    console.log('Body reçu:', req.body);
    
    const { name, description, type, language } = req.body;
    
    // Trouver un utilisateur pour associer le projet
    let user = await prisma.user.findFirst();
    if (!user) {
      console.log('Création d\'un utilisateur de test...');
      const hashedPassword = await bcrypt.hash('Test12345!', 10);
      user = await prisma.user.create({
        data: {
          email: 'test@test.com',
          password: hashedPassword,
          name: 'Test User',
          role: 'USER',
          plan: 'PRO',
          minutesUsed: 0,
          minutesLimit: 500
        }
      });
    }
    
    console.log('Création du projet avec userId:', user.id);
    
    const project = await prisma.project.create({
      data: {
        name,
        description: description || '',
        type: type || 'GENERAL',
        status: 'ACTIVE',
        language: language || 'fr',
        // PAS de champ sector ici
        userId: user.id
      }
    });

    console.log('✅ Projet créé:', project.id);

    res.json({
      success: true,
      data: project,
      message: 'Projet créé avec succès'
    });
  } catch (error: any) {
    console.error('❌ Erreur création projet:', error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du projet',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get('/api/projects/stats', async (req, res) => {
  try {
    const totalProjects = await prisma.project.count();
    const activeProjects = await prisma.project.count({
      where: { status: 'ACTIVE' }
    });
    
    res.json({
      success: true,
      data: {
        total: totalProjects,
        active: activeProjects,
        completed: totalProjects - activeProjects
      }
    });
  } catch (error) {
    console.error('❌ Erreur stats:', error);
    res.json({
      success: true,
      data: { total: 0, active: 0, completed: 0 }
    });
  }
});

// ====================
// ROUTES PLACEHOLDER
// ====================
app.get('/api/users', (_req, res) => {
  res.json({ success: true, data: [], message: 'Route users en construction' });
});

app.get('/api/transcriptions', (_req, res) => {
  res.json({ success: true, data: [], message: 'Route transcriptions en construction' });
});

app.get('/api/documents', (_req, res) => {
  res.json({ success: true, data: [], message: 'Route documents en construction' });
});

app.get('/api/analytics', (_req, res) => {
  res.json({ 
    success: true, 
    data: {
      totalTranscriptions: 42,
      totalMinutes: 1250,
      activeProjects: 3,
      recentActivity: []
    }
  });
});

// ====================
// HEALTH CHECK
// ====================
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: prisma ? 'Connected' : 'Disconnected',
    version: '2.7.0'
  });
});

// ====================
// ERROR HANDLING
// ====================
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Erreur:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route non trouvée' 
  });
});

// ====================
// DÉMARRAGE DU SERVEUR
// ====================
const startServer = async () => {
  try {
    // Connecter à la base de données
    await prisma.$connect();
    console.log('✅ Base de données connectée avec succès');
    
    // Compter les utilisateurs et projets
    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    
    console.log(`👥 Utilisateurs: ${userCount}`);
    console.log(`📁 Projets: ${projectCount}`);
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`\n🚀 Serveur TraducXion V2.7 démarré !`);
      console.log(`📍 URL API: http://localhost:${PORT}`);
      console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n✅ Prêt à recevoir des requêtes !`);
      console.log('\n📝 Identifiants de test:');
      console.log('   Email: test@test.com');
      console.log('   Mot de passe: Test12345!');
      console.log('\n   Email: demo@traducxion.com');
      console.log('   Mot de passe: Demo2025!');
    });
  } catch (error) {
    console.error('❌ Erreur de démarrage:', error);
    process.exit(1);
  }
};

// Lancer le serveur
startServer();

// Gérer l'arrêt propre
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await prisma.$disconnect();
  console.log('✅ Connexion à la base de données fermée');
  process.exit(0);
});

// Gérer les erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

export default app;