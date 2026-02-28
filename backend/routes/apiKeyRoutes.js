const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
  createApiKey,
  getApiKeys,
  revokeApiKey
} = require("../controllers/apiKeyController");

// =============================
// ROUTES
// =============================

router.post("/", verifyToken, createApiKey);
router.get("/", verifyToken, getApiKeys);
router.delete("/:id", verifyToken, revokeApiKey);

module.exports = router;