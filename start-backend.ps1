Write-Host "🚀 Démarrage du Backend TraducXion..." -ForegroundColor Cyan

# Aller dans le backend
cd C:\PROJETS-DEVELOPPEMENT\traduc-clone\backend

# Vérifier les dépendances
Write-Host "📦 Vérification des dépendances..." -ForegroundColor Yellow
npm install

# Générer Prisma
Write-Host "🔧 Génération du client Prisma..." -ForegroundColor Yellow
npx prisma generate

# Pousser le schéma si nécessaire
Write-Host "📊 Mise à jour de la base de données..." -ForegroundColor Yellow
npx prisma db push

# Lancer le serveur
Write-Host "✅ Lancement du serveur sur port 5000..." -ForegroundColor Green
npm run dev