// backend/src/config/redis.js
const redis = require('redis');

let redisClient;

const initRedis = async () => {
  redisClient = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    },
    password: process.env.REDIS_PASSWORD || undefined,
  });

  redisClient.on('error', (err) => {
    console.error('Erreur Redis:', err);
  });

  redisClient.on('connect', () => {
    console.log('Redis connecté');
  });

  await redisClient.connect();
  return redisClient;
};

const getRedisClient = () => redisClient;

module.exports = { initRedis, getRedisClient };