# Créer package.json
@'
{
  "name": "traduc-backend",
  "version": "1.0.0",
  "description": "Backend API pour TraducXion",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
'@ | Out-File -FilePath "package.json" -Encoding utf8

Write-Host "✅ package.json créé" -ForegroundColor Green