const express = require("express");
const router = express.Router();

const ApiKey = require("../models/apiKey");
const RequestLog = require("../models/requestLog");
const rateLimiter = require("../middleware/rateLimiter");

router.post("/process", rateLimiter, async (req, res) => {
  try {
    const apiKeyValue = req.headers["x-api-key"];
    const { text } = req.body;

    // 1️⃣ Missing API key
    if (!apiKeyValue) {
      return res.status(401).json({ message: "API key missing" });
    }

    const apiKey = await ApiKey.findOne({ key: apiKeyValue });

    // 2️⃣ Invalid API key
    if (!apiKey) {
  return res.status(401).json({ message: "Invalid API key" });
}


    // 3️⃣ Revoked key
    if (apiKey.status !== "Active") {
      await RequestLog.create({
        apiKey: apiKey._id,
        user: apiKey.user,
        endpoint: "/api/process",
        usageConsumed: 0,
        status: "Failed"
      });

      return res.status(403).json({ message: "API key revoked" });
    }

    // 4️⃣ Usage limit exceeded
    if (apiKey.usageCount >= apiKey.usageLimit) {
      await RequestLog.create({
        apiKey: apiKey._id,
        user: apiKey.user,
        endpoint: "/api/process",
        usageConsumed: 0,
        status: "Failed"
      });

      return res.status(403).json({ message: "Usage limit exceeded" });
    }

    // 5️⃣ Process request
    const wordCount = text ? text.split(" ").length : 0;

    apiKey.usageCount += 1;
    await apiKey.save();

    await RequestLog.create({
      apiKey: apiKey._id,
      user: apiKey.user,
      endpoint: "/api/process",
      usageConsumed: 1,
      status: "Success"
    });

    res.json({
      message: "Text processed successfully",
      wordCount,
      usageCount: apiKey.usageCount
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
