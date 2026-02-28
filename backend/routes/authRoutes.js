
const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");
const {
  validateSignup,
  validateLogin
} = require("../middleware/validators/authValidator");

// =============================
// ROUTES
// =============================
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               inviteCode:
 *                 type: string
 *                 example: RISHI2026
 *     responses:
 *       201:
 *         description: User registered successfully
 */

router.post("/signup", validateSignup, signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 */


router.post("/login", validateLogin, login);

module.exports = router;