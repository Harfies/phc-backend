// Limits repeated requests

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins

  max: 100,

  message: "Too many requests, try again later",
});

module.exports = limiter;
