
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const ApiKey = require("../models/apiKey");
const RequestLog = require("../models/requestLog");
const asyncHandler = require("../utils/asyncHandler");
const {
  getRecommendations,
  getTopRatedMovies,
  searchMovies,
  getMoviesByGenre
} = require("../utils/recommendationEngine");
const { successResponse, errorResponse } = require("../utils/apiResponse");



/**
 * @swagger
 * /api/process:
 *   post:
 *     summary: Get movie recommendations
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apiKey:
 *                 type: string
 *                 example: mm_live_abc123
 *               movie:
 *                 type: string
 *                 example: Inception
 *     responses:
 *       200:
 *         description: Recommendations generated successfully
 */


// =============================
// PROCESS REQUEST (API USAGE)
// =============================
router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
  console.log("BODY RECEIVED:", req.body);
   const { apiKey, movie } = req.body;

    const keyDoc = await ApiKey.findOne({
      key: apiKey,
      status: "Active"
    });

    if (!keyDoc) {
      return errorResponse(res, "Invalid API key", "INVALID_API_KEY", 400);
    }

    if (keyDoc.usageLimit <= 0) {
      return errorResponse(res, "API usage limit exceeded", "USAGE_LIMIT_EXCEEDED", 400);
    }

    // 🎬 Get movie recommendations
const recommendations = getRecommendations(movie);

if (recommendations.error) {
  return errorResponse(res, recommendations.error, "MOVIE_NOT_FOUND", 400);
}
    keyDoc.usageLimit -= 1;
    await keyDoc.save();

    await RequestLog.create({
      user: keyDoc.user,
      apiKey: keyDoc._id,
      endpoint: "/api/process",
      ipAddress: req.ip,
      usageConsumed: 1,
      status: "Success"
    });

    return successResponse(
  res,
  "Recommendations generated successfully",
  {
    basedOn: recommendations.basedOn,
    genres: recommendations.genres,
    results: recommendations.results
  },
  {
    remainingUsage: keyDoc.usageLimit
  }
);

  })
);
// =============================
// TOP RATED MOVIES
// =============================
/**
 * @swagger
 * /api/process/top-rated:
 *   get:
 *     summary: Get top rated movies
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Top rated movies fetched
 */

router.get(
  "/top-rated",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { apiKey } = req.query;

    const keyDoc = await ApiKey.findOne({
      key: apiKey,
      status: "Active"
    });

    if (!keyDoc) {
      return errorResponse(res, "Invalid API key", "INVALID_API_KEY", 400);
    }

    if (keyDoc.usageLimit <= 0) {
      return errorResponse(res, "API usage limit exceeded", "USAGE_LIMIT_EXCEEDED", 400);
    }

    const topMovies = getTopRatedMovies(10);

    keyDoc.usageLimit -= 1;
    await keyDoc.save();

    await RequestLog.create({
      user: keyDoc.user,
      apiKey: keyDoc._id,
      endpoint: "/api/process/top-rated",
      ipAddress: req.ip,
      usageConsumed: 1,
      status: "Success"
    });

    return successResponse(
      res,
      "Top rated movies fetched successfully",
      { results: topMovies },
      { remainingUsage: keyDoc.usageLimit }
    );
  })
);

// =============================
// SEARCH MOVIES
// =============================
/**
 * @swagger
 * /api/process/search:
 *   get:
 *     summary: Search movies
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */

router.get(
  "/search",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { apiKey, q } = req.query;

    if (!q) {
      return errorResponse(res, "Search query is required", "MISSING_QUERY", 400);
    }

    const keyDoc = await ApiKey.findOne({
      key: apiKey,
      status: "Active"
    });

    if (!keyDoc) {
      return errorResponse(res, "Invalid API key", "INVALID_API_KEY", 400);
    }

    if (keyDoc.usageLimit <= 0) {
      return errorResponse(res, "API usage limit exceeded", "USAGE_LIMIT_EXCEEDED", 400);
    }

    const results = searchMovies(q);

    keyDoc.usageLimit -= 1;
    await keyDoc.save();

    await RequestLog.create({
      user: keyDoc.user,
      apiKey: keyDoc._id,
      endpoint: "/api/process/search",
      ipAddress: req.ip,
      usageConsumed: 1,
      status: "Success"
    });

    return successResponse(
      res,
      "Search results fetched successfully",
      { query: q, results },
      { remainingUsage: keyDoc.usageLimit }
    );
  })
);

// =============================
// MOVIES BY GENRE
// =============================
/**
 * @swagger
 * /api/process/search:
 *   get:
 *     summary: Search movies
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */

router.get(
  "/genre/:genre",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { apiKey } = req.query;
    const { genre } = req.params;

    const keyDoc = await ApiKey.findOne({
      key: apiKey,
      status: "Active"
    });

    if (!keyDoc) {
      return errorResponse(res, "Invalid API key", "INVALID_API_KEY", 400);
    }

    if (keyDoc.usageLimit <= 0) {
      return errorResponse(res, "API usage limit exceeded", "USAGE_LIMIT_EXCEEDED", 400);
    }

    const results = getMoviesByGenre(genre);

    if (results.length === 0) {
      return errorResponse(res, "No movies found for this genre", "GENRE_NOT_FOUND", 404);
    }

    keyDoc.usageLimit -= 1;
    await keyDoc.save();

    await RequestLog.create({
      user: keyDoc.user,
      apiKey: keyDoc._id,
      endpoint: `/api/process/genre/${genre}`,
      ipAddress: req.ip,
      usageConsumed: 1,
      status: "Success"
    });

    return successResponse(
      res,
      "Movies by genre fetched successfully",
      { genre, results },
      { remainingUsage: keyDoc.usageLimit }
    );
  })
);

module.exports = router;