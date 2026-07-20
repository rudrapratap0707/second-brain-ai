const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No Token
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    console.log("========== AUTH DEBUG ==========");
    console.log("Authorization Header:", req.headers.authorization);
    console.log("Token:", token);
    console.log("JWT Secret Exists:", !!process.env.JWT_SECRET);

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    // Find User
    const user = await User.findById(decoded.id).select("-password");

    console.log("User Found:", user);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("========== AUTH ERROR ==========");
    console.error(error);

    return res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = protect;