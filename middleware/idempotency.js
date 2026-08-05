// prevent duplicate request

const redis = require("../config/redis");

const idempotency = async (req, res, next) => {
  try {
    const key = req.headers["idempotency-key"];

    if (!key) {
      return next();
    }

    const cachedResponse = await redis.get(`idem:${key}`);

    if (cachedResponse) {
      return res.status(200).json(JSON.parse(cachedResponse));
    }

    const originalJson = res.json;

    res.json = function (body) {
      redis.set(`idem:${key}`, JSON.stringify(body), {
        EX: 60 * 60,
      });

      return originalJson.call(this, body);
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = idempotency;
