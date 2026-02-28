const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Active",
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  usageLimit: {
    type: Number,
    default: 100, // Free tier limit
  },
});

module.exports = mongoose.model("ApiKey", apiKeySchema);
