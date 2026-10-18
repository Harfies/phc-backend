const { createClient } = require("redis");

const dns = require("node:dns");

dns.setServers(["1.1.1.1", "1.0.0.1"]); // Cloudflare DNS servers

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    reconnectStrategy: (retries) => {
      if (retries >= 5) {
        console.error("Redis: maximum reconnection attempts reached.");
        return new Error("Redis connection failed.");
      }

      return Math.min(retries * 1000, 5000);
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
});

redisClient.on("connect", () => {
  console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
  console.log("Redis connected successfully.");
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

module.exports = redisClient;
