// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ msg: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Now available in next routes
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
