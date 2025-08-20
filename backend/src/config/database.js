// backend/src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/traduckxion', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connecté: ${conn.connection.host}`);

    // Créer les index
    mongoose.connection.on('connected', () => {
      console.log('Création des index MongoDB...');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Erreur MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB déconnecté');
    });

  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;