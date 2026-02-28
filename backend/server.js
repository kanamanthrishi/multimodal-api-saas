const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const rateLimit = require("express-rate-limit");

const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const apiKeyRoutes = require("./routes/apiKeyRoutes");
const processRoutes = require("./routes/processRoutes");
const verifyToken = require("./middleware/verifyToken");
const analyticsRoutes = require("./routes/analyticsRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const User = require("./models/user");

const app = express();

// =============================
// Middlewares
// =============================
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",  // your local frontend
    "https://your-frontend.onrender.com" // future frontend
  ]
}));
app.use(helmet());




// =============================
// Rate Limiter (DEFINE FIRST)
// =============================
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 25,             // 25 requests per minute
  message: { message: "Too many requests. Please try again later." }
});

// Apply rate limit ONLY to process route
app.use("/api/process", apiLimiter);

// =============================
// Routes
// =============================
//app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/keys", apiKeyRoutes);
app.use("/api/process", processRoutes);
app.use("/api/analytics", analyticsRoutes);
app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorMiddleware);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working");
});

// Protected route
app.get("/api/protected", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "You have accessed a protected route!",
      user: user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
// MongoDB Connection
// =============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


  const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);
// =============================
// Start Server
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);
});

