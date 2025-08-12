// Créer un nouveau projet
async create(req: AuthRequest, res: Response) {
  try {
    console.log('🔵 ============ DÉBUT CRÉATION PROJET ============');
    console.log('📨 Body complet reçu:', JSON.stringify(req.body, null, 2));
    console.log('👤 User dans req:', req.user);
    console.log('🆔 UserId dans req:', req.userId);
    
    let userId = req.user?.id || req.userId;
    const { name, description, language, type, sector } = req.body;

    console.log('📝 Données extraites:', { 
      name, 
      description, 
      language, 
      type, 
      sector,
      userId 
    });

    if (!name) {
      console.log('❌ Nom manquant');
      return res.status(400).json({
        success: false,
        message: 'Le nom du projet est requis'
      });
    }

    // Si pas d'userId, utiliser l'utilisateur de test
    if (!userId) {
      console.log('⚠️ Pas d\'userId, recherche utilisateur test...');
      
      try {
        let testUser = await prisma.user.findFirst({
          where: { email: 'test@test.com' }
        });
        
        if (!testUser) {
          console.log('📝 Création utilisateur test...');
          const hashedPassword = await bcrypt.hash('Test12345!', 10);
          testUser = await prisma.user.create({
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
          console.log('✅ Utilisateur test créé:', testUser.id);
        } else {
          console.log('✅ Utilisateur test trouvé:', testUser.id);
        }
        
        userId = testUser.id;
      } catch (userError: any) {
        console.error('❌ Erreur création/recherche utilisateur:', userError.message);
        console.error('Stack:', userError.stack);
        throw userError;
      }
    }

    // Vérifier que l'utilisateur existe vraiment
    console.log('🔍 Vérification de l\'existence de l\'utilisateur:', userId);
    const userCheck = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!userCheck) {
      console.error('❌ L\'utilisateur n\'existe pas dans la base:', userId);
      return res.status(400).json({
        success: false,
        message: 'Utilisateur non trouvé dans la base de données'
      });
    }
    
    console.log('✅ Utilisateur vérifié:', userCheck.email);

    // Préparer les données du projet
    const projectData = {
      name,
      description: description || '',
      language: language || 'fr',
      type: type || 'GENERAL',
      status: 'ACTIVE',
      sector: sector || 'business',
      userId: userId
    };
    
    console.log('📤 Données du projet à créer:', JSON.stringify(projectData, null, 2));

    // Tentative de création
    let project;
    try {
      console.log('🔨 Appel Prisma create...');
      project = await prisma.project.create({
        data: projectData
      });
      console.log('✅ Projet créé avec succès:', project);
    } catch (prismaError: any) {
      console.error('❌ Erreur Prisma lors de la création:');
      console.error('Code:', prismaError.code);
      console.error('Message:', prismaError.message);
      console.error('Meta:', prismaError.meta);
      
      if (prismaError.code === 'P2002') {
        return res.status(400).json({
          success: false,
          message: 'Un projet avec ce nom existe déjà'
        });
      }
      
      if (prismaError.code === 'P2003') {
        return res.status(400).json({
          success: false,
          message: 'Problème avec la référence utilisateur'
        });
      }
      
      if (prismaError.code === 'P2025') {
        return res.status(400).json({
          success: false,
          message: 'Enregistrement introuvable'
        });
      }
      
      // Si c'est une erreur de champ manquant
      if (prismaError.message.includes('Unknown arg')) {
        console.error('❌ Champ inconnu dans le schéma Prisma');
        
        // Essayer sans le champ sector
        console.log('🔄 Tentative sans le champ sector...');
        try {
          project = await prisma.project.create({
            data: {
              name,
              description: description || '',
              language: language || 'fr',
              type: type || 'GENERAL',
              status: 'ACTIVE',
              userId: userId
              // sector retiré
            }
          });
          console.log('✅ Projet créé sans sector:', project);
        } catch (retryError: any) {
          console.error('❌ Échec même sans sector:', retryError.message);
          throw retryError;
        }
      } else {
        throw prismaError;
      }
    }

    console.log('🔵 ============ FIN CRÉATION PROJET ============');

    res.status(201).json({
      success: true,
      data: project,
      message: 'Projet créé avec succès'
    });
    
  } catch (error: any) {
    console.error('🔴 ============ ERREUR CRÉATION PROJET ============');
    console.error('Type d\'erreur:', error.constructor.name);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);
    
    if (error.meta) {
      console.error('Meta:', error.meta);
    }
    
    console.error('🔴 ============ FIN ERREUR ============');
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du projet',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        meta: error.meta
      } : undefined
    });
  }
},