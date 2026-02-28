const mongoose = require("mongoose");

const requestLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  apiKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ApiKey",
    required: true
  },

  endpoint: {
    type: String,
    required: true
  },

  ipAddress: {
    type: String
  },

  usageConsumed: {
    type: Number,
    default: 1
  },

  status: {
    type: String,
    enum: ["Success", "Failed"],
    default: "Success"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("RequestLog", requestLogSchema);
