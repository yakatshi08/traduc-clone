import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Créer un utilisateur de test
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@traducxion.com',
      password: hashedPassword,
      name: 'Demo User',
      role: 'USER',
      plan: 'FREE',
      minutesLimit: 60
    }
  });

  console.log('✅ Utilisateur de test créé:', user.email);

  // Créer un projet de test
  const project = await prisma.project.create({
    data: {
      name: 'Projet de démonstration',
      description: 'Un projet pour tester l\'application',
      type: 'GENERAL',
      userId: user.id
    }
  });

  console.log('✅ Projet de test créé:', project.name);
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });