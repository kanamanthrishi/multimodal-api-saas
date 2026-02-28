const ApiKey = require("../models/apiKey");

const checkApiKey = async (req, res, next) => {
  try {
    const apiKeyValue = req.headers["x-api-key"];

    if (!apiKeyValue) {
      return res.status(401).json({
        message: "API key required"
      });
    }

    const apiKey = await ApiKey.findOne({ key: apiKeyValue });

    if (!apiKey) {
      return res.status(403).json({
        message: "Invalid API key"
      });
    }

    if (apiKey.status === "Revoked") {
      return res.status(403).json({
        message: "API key is revoked"
      });
    }

    // Increase usage count
    apiKey.usageCount += 1;
    apiKey.lastUsedAt = new Date();
    await apiKey.save();

    // Attach key info to request
    req.apiKey = apiKey;

    next();

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkApiKey;
