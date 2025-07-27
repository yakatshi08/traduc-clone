# TraducXion V2.5

## 🚀 Plateforme intelligente de transcription et traduction

TraducXion V2.5 est une plateforme SaaS multilingue de transcription et traduction intelligente de documents, vidéos et audios. Elle vise à devenir un acteur leader mondial dans le traitement automatisé des contenus multimédias professionnels.

![TraducXion V2.5](https://img.shields.io/badge/Version-2.5-violet?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.1-cyan?style=for-the-badge&logo=tailwindcss)

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Palette de couleurs](#-palette-de-couleurs)
- [Objectifs stratégiques](#-objectifs-stratégiques-2025-2026)
- [Contribution](#-contribution)
- [Licence](#-licence)

## ✨ Fonctionnalités

### 🎯 Fonctionnalités principales
- **Interface multilingue** : Support complet FR, EN, IT, ES, DE
- **Transcription intelligente** : Moteur IA hybride (Whisper, Deepgram, ElevenLabs, OpenAI)
- **Traduction automatique** : Modèles fine-tunés pour une précision optimale
- **Dashboard analytique** : Suivi des projets et statistiques en temps réel
- **Upload multiformat** : Support MP3, MP4, WAV, M4A, PDF, DOCX, TXT
- **Diarisation avancée** : Identification automatique des locuteurs
- **Éditeur collaboratif** : Édition en temps réel avec assistance IA

### 🔧 Fonctionnalités techniques
- **Mode offline** : Synchronisation cloud automatique
- **Connecteurs natifs** : Google Drive, Dropbox, OneDrive
- **Modules sectoriels** : Médical, juridique, business, éducation
- **Export XBRL** : Génération automatique de rapports
- **WER < 4%** : Taux d'erreur de mots ultra-faible
- **Architecture modulaire** : Composants réutilisables et maintenables

## 🛠 Technologies

### Frontend
- **React 18.3.1** - Framework JavaScript moderne
- **TypeScript 5.5.3** - Typage statique pour JavaScript
- **Tailwind CSS 3.4.1** - Framework CSS utilitaire
- **Vite 5.4.2** - Build tool et dev server ultra-rapide
- **Lucide React** - Bibliothèque d'icônes modernes

### Outils de développement
- **ESLint** - Linting et qualité du code
- **PostCSS** - Traitement CSS avancé
- **Autoprefixer** - Compatibilité navigateurs automatique

### IA et APIs (à intégrer)
- **OpenAI GPT** - Traitement du langage naturel
- **Whisper** - Transcription audio
- **Deepgram** - Reconnaissance vocale
- **ElevenLabs** - Synthèse vocale

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Git

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/traducxion-v2.5.git
cd traducxion-v2.5
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le serveur de développement**
```bash
npm run dev
```

4. **Ouvrir l'application**
```
http://localhost:5173
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# APIs IA
VITE_OPENAI_API_KEY=your_openai_key
VITE_DEEPGRAM_API_KEY=your_deepgram_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key

# Cloud Storage
VITE_GOOGLE_DRIVE_CLIENT_ID=your_google_client_id
VITE_DROPBOX_APP_KEY=your_dropbox_key
VITE_ONEDRIVE_CLIENT_ID=your_onedrive_client_id

# Base URL
VITE_API_BASE_URL=https://api.traducxion.com
```

### Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Aperçu de la build
npm run preview

# Linting
npm run lint
```

## 📖 Utilisation

### Interface utilisateur

1. **Sélection de langue** : Utilisez le sélecteur dans le header
2. **Upload de fichiers** : Glissez-déposez vos fichiers dans la zone prévue
3. **Suivi des projets** : Consultez le dashboard pour voir l'avancement
4. **Export** : Générez vos rapports XBRL depuis les actions rapides

### Navigation

- **Dashboard** : Vue d'ensemble et statistiques
- **Projets** : Gestion complète des projets
- **Analytiques** : Métriques et performances
- **Paramètres** : Configuration utilisateur

## 📁 Structure du projet

```
src/
├── components/           # Composants React
│   ├── Dashboard/       # Composants du dashboard
│   │   ├── Dashboard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── StatsCard.tsx
│   │   └── UploadZone.tsx
│   └── Layout/          # Composants de mise en page
│       ├── Header.tsx
│       └── Sidebar.tsx
├── hooks/               # Hooks personnalisés
│   └── useLanguage.ts   # Gestion multilingue
├── types/               # Définitions TypeScript
│   └── index.ts
├── App.tsx              # Composant principal
├── main.tsx            # Point d'entrée
└── index.css           # Styles globaux
```

## 🎨 Palette de couleurs

### Couleurs principales
- **Violet** : `#8b5cf6` - Icônes catégories
- **Indigo** : `#6366f1` - Boutons/liens actifs, bouton Valider
- **Emerald** : `#10b981` - Bouton Générer XBRL, validation réussie
- **Rouge** : `#ef4444` - Validation erreur
- **Slate-900** : `#0f172a` - Fond principal

### Badges et états
- **Badge "Prêt"** : Fond `#d1fae5`, texte `#065f46`
- **Info box** : Fond bleu transparent, texte `#93bbfe`

## 🎯 Objectifs stratégiques 2025-2026

- ✅ **WER < 4%** - Taux d'erreur de mots ultra-faible
- 🎯 **20K utilisateurs actifs** mensuels
- 💰 **3M€ de revenus** annuels récurrents
- 🔗 **Connecteurs cloud** natifs (Drive, Dropbox, OneDrive)
- 🌍 **100% multilingue** sur toute l'interface

## 🤝 Contribution

### Workflow de développement

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Standards de code

- Utilisez TypeScript pour tous les nouveaux fichiers
- Suivez les conventions ESLint configurées
- Documentez les fonctions complexes
- Testez vos composants avant soumission

### Architecture

- **Composants** : Un composant par fichier, nommage PascalCase
- **Hooks** : Préfixe `use`, logique réutilisable
- **Types** : Définitions centralisées dans `/types`
- **Styles** : Tailwind CSS, classes utilitaires

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Documentation** : [docs.traducxion.com](https://docs.traducxion.com)
- **Support** : support@traducxion.com
- **Issues** : [GitHub Issues](https://github.com/votre-username/traducxion-v2.5/issues)

---

<div align="center">

**TraducXion V2.5** - Révolutionnez votre workflow de transcription et traduction

[🌐 Site web](https://traducxion.com) • [📚 Documentation](https://docs.traducxion.com) • [💬 Discord](https://discord.gg/traducxion)

</div>