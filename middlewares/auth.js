const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader); // Log header

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("Token verification error:", err); // Log error
        return res.status(403).json({ message: "Token is not valid" }); // Forbidden
      }
      req.user = user;
      console.log("Verified User:", user); // Log user
      next();
    });
  } else {
    console.log("No authorization header"); // Log missing header
    res.status(401).json({ message: "No token provided" }); // Unauthorized
  }
};

const isAdmin = (req, res, next) => {
  console.log("Checking admin role for user:", req.user); // Log user
  if (req.user && parseInt(req.user.role) === 1945) {
    next();
  } else {
    res.status(403).json({ message: "Require Admin Role" });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
