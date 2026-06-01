// Handles patient caching logic

const redisClient = require("../config/redis");

// Get cached patients
const getCachedPatients = async () => {
  const cachedPatients = await redisClient.get("patients");

  // If cache exists
  if (cachedPatients) {
    return JSON.parse(cachedPatients);
  }

  return null;
};

// Store patients in Redis cache
const setCachedPatients = async (patients) => {
  await redisClient.set(
    "patients",

    JSON.stringify(patients),

    {
      EX: 60, // expires after 60 seconds
    },
  );
};

module.exports = {
  getCachedPatients,
  setCachedPatients,
};
