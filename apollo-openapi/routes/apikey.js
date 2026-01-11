const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();


// GET API key milik user
router.get("/me", auth, (req, res) => {
  db.query(
    "SELECT api_key FROM api_keys WHERE user_id=? AND status='active'",
    [req.user.id],
    (err, rows) => {
      if (rows.length === 0) return res.json({});
      res.json({ apiKey: rows[0].api_key });
    }
  );
});


// Generate API key baru
router.post("/generate", auth, (req, res) => {
  const apiKey = uuidv4();

  // Matikan key lama
  db.query("UPDATE api_keys SET status='revoked' WHERE user_id=?", [req.user.id]);

  // Simpan key baru
  db.query(
    "INSERT INTO api_keys (user_id, api_key, status) VALUES (?, ?, 'active')",
    [req.user.id, apiKey],
    () => {
      res.json({ apiKey });
    }
  );
});

module.exports = router;
