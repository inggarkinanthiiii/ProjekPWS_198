const db = require("../db");

module.exports = (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key) return res.status(401).json({ message: "API Key required" });

  db.query("SELECT * FROM api_keys WHERE api_key=? AND status='active'", [key], (err, result) => {
    if (result.length === 0) return res.status(403).json({ message: "Invalid API Key" });
    next();
  });
};
