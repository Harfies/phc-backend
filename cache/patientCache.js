const redisClient = require("../config/redis");

const clearPatientCache = async () => {
  try {
    const keys = await redisClient.keys("patients:*");

    if (keys.length > 0) {
      await redisClient.del(keys);

      console.log(`🧹 Cleared ${keys.length} patient cache key(s).`);
    }
  } catch (error) {
    console.error("Redis cache clear error:", error.message);
  }
};

module.exports = {
  clearPatientCache,
};
