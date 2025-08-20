require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.5.0',
    message: 'TraduckXion Backend API is running!'
  });
});

// Routes basiques pour test
app.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  res.json({
    success: true,
    message: 'User registered successfully',
    user: { email, firstName, lastName },
    token: 'fake-jwt-token-' + Date.now()
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  res.json({
    success: true,
    message: 'Login successful',
    token: 'fake-jwt-token-' + Date.now(),
    user: { email }
  });
});

app.get('/api/auth/profile', (req, res) => {
  res.json({
    success: true,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`
    ========================================
    🚀 TraduckXion Backend v2.5
    📡 Serveur démarré sur le port ${PORT}
    🌍 http://localhost:${PORT}
    📅 ${new Date().toLocaleString('fr-FR')}
    ========================================
  `);
});
