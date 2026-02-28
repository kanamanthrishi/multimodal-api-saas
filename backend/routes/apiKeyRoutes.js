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
/**
 * @swagger
 * /api/keys:
 *   post:
 *     summary: Generate new API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: API key created
 */

router.post("/", verifyToken, createApiKey);
/**
 * @swagger
 * /api/keys:
 *   get:
 *     summary: Get all API keys for user
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of API keys
 */

router.get("/", verifyToken, getApiKeys);

/**
 * @swagger
 * /api/keys/{id}:
 *   delete:
 *     summary: Revoke API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key revoked
 */

router.delete("/:id", verifyToken, revokeApiKey);

module.exports = router;