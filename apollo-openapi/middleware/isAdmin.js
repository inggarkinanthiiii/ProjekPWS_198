const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ⚡ samakan
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    req.user = decoded; // optional: kalau perlu akses id di route
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
