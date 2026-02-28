/*const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  successResponse,
  errorResponse
} = require("../utils/responseHandler");


// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return errorResponse(res, 400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();

    return successResponse(
      res,
      201,
      "User registered successfully"
    );

  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Server error", error.message);
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, 400, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 400, "Invalid email or password");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return successResponse(
      res,
      200,
      "Login successful",
      { token }
    );

  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Server error", error.message);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");

// =============================
// ROUTES
// =============================

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
*/
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

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);

module.exports = router;