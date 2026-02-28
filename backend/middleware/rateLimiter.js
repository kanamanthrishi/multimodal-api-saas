const ApiKey = require("../models/apiKey");

const rateLimitStore = {}; // in-memory store

const rateLimiter = async (req, res, next) => {
  try {
    const apiKeyValue = req.headers["x-api-key"];

    if (!apiKeyValue) {
      return res.status(401).json({ message: "API key missing" });
    }

    const apiKey = await ApiKey.findOne({ key: apiKeyValue });

    if (!apiKey || apiKey.status !== "Active") {
      return res.status(401).json({ message: "Invalid or revoked API key" });
    }

    // Plan-based limits per minute
    const limitPerMinute = apiKey.usageLimit === 1000 ? 100 : 20;

    const currentTime = Date.now();
    const windowTime = 60 * 1000; // 1 minute

    if (!rateLimitStore[apiKeyValue]) {
      rateLimitStore[apiKeyValue] = [];
    }

    // Remove requests older than 1 minute
    rateLimitStore[apiKeyValue] = rateLimitStore[apiKeyValue].filter(
      timestamp => currentTime - timestamp < windowTime
    );

    if (rateLimitStore[apiKeyValue].length >= limitPerMinute) {
      return res.status(429).json({
        message: "Rate limit exceeded. Try again later."
      });
    }

    // Add current request
    rateLimitStore[apiKeyValue].push(currentTime);

    next();

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = rateLimiter;
