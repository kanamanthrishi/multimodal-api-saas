const ApiKey = require("../models/apiKey");
const User = require("../models/user");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// =============================
// CREATE API KEY
// =============================
exports.createApiKey = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    const maxKeys = user.plan === "Pro" ? 10 : 3;
    const usageLimit = user.plan === "Pro" ? 1000 : 100;

    const activeKeysCount = await ApiKey.countDocuments({
      user: req.user.id,
      status: "Active"
    });

    if (activeKeysCount >= maxKeys) {
      return errorResponse(
        res,
        400,
        `Maximum ${maxKeys} active API keys allowed for ${user.plan} plan`
      );
    }

    const newKey = new ApiKey({
      user: req.user.id,
      key: "mm_live_" + Math.random().toString(36).substring(2, 15),
      usageLimit
    });

    await newKey.save();

    return successResponse(
      res,
      201,
      "API key generated successfully",
      newKey
    );

  } catch (error) {
    next(error);
  }
};


// =============================
// GET ALL API KEYS
// =============================
exports.getApiKeys = async (req, res, next) => {
  try {
    const keys = await ApiKey.find({ user: req.user.id });

    return successResponse(
      res,
      200,
      "API keys fetched successfully",
      keys
    );

  } catch (error) {
    next(error);
  }
};


// =============================
// REVOKE API KEY
// =============================
exports.revokeApiKey = async (req, res, next) => {
  try {
    const apiKey = await ApiKey.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!apiKey) {
      return errorResponse(res, 404, "API key not found");
    }

    apiKey.status = "Revoked";
    await apiKey.save();

    return successResponse(
      res,
      200,
      "API key revoked successfully"
    );

  } catch (error) {
    next(error);
  }
};