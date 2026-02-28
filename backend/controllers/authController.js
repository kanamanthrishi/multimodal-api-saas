const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../utils/responseHandler");

// =============================
// SIGNUP
// =============================
// =============================
// SIGNUP (INVITE PROTECTED)
// =============================
exports.signup = async (req, res, next) => {
  try {
    const { email, password, inviteCode } = req.body;

    if (!email || !password || !inviteCode) {
      return errorResponse(res, 400, "Email, password and invite code are required");
    }

    // 🔐 Invite Code Validation
    if (inviteCode !== process.env.INVITE_CODE) {
      return errorResponse(res, 403, "Invalid invite code");
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
    next(error);
  }
};

// =============================
// LOGIN
// =============================
exports.login = async (req, res, next) => {
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
    next(error);
  }
};