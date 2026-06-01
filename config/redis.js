// Redis connection configuration

const redis = require("redis");

console.log("REDIS URL:", process.env.REDIS_URL);

// Create Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();

    console.log("✅ Redis connected");
  } catch (error) {
    console.error("❌ Redis connection error:", error);
  }
})();

module.exports = redisClient;
