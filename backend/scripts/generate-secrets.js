const crypto = require('crypto');

// Générer des secrets sécurisés
const secrets = {
  JWT_SECRET: crypto.randomBytes(64).toString('base64'),
  JWT_REFRESH_SECRET: crypto.randomBytes(64).toString('base64'),
  SESSION_SECRET: crypto.randomBytes(64).toString('base64'),
  ENCRYPTION_KEY: crypto.randomBytes(32).toString('base64'),
  WEBHOOK_SECRET: `wh_sec_${crypto.randomBytes(32).toString('hex')}`,
};

console.log('🔐 Secrets générés (à copier dans .env) :\n');
Object.entries(secrets).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log('\n✅ Copiez ces valeurs dans votre fichier .env');