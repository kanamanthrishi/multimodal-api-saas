const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const verifyToken = require("../middleware/verifyToken");
const ApiKey = require("../models/apiKey");
const RequestLog = require("../models/requestLog");
const asyncHandler = require("../utils/asyncHandler");

// =============================
// USER USAGE SUMMARY
// =============================
router.get(
  "/summary",
  verifyToken,
  asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const totalKeys = await ApiKey.countDocuments({ user: userId });

    const activeKeys = await ApiKey.countDocuments({
      user: userId,
      status: "Active"
    });

    const revokedKeys = await ApiKey.countDocuments({
      user: userId,
      status: "Revoked"
    });

    const totalRequests = await RequestLog.countDocuments({
      user: userId
    });

    const usageAggregation = await RequestLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: null,
          totalUsage: { $sum: "$usageConsumed" }
        }
      }
    ]);

    const totalUsage =
      usageAggregation.length > 0
        ? usageAggregation[0].totalUsage
        : 0;

    res.status(200).json({
      totalKeys,
      activeKeys,
      revokedKeys,
      totalRequests,
      totalUsage
    });

  })
);

module.exports = router;