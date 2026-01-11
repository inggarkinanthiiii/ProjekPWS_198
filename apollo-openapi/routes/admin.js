const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// List semua user & API key
router.get("/users", auth, isAdmin, (req, res) => {
    const sql = `
    SELECT users.id, users.name, users.email, users.role,
           api_keys.api_key, api_keys.status
    FROM users
    LEFT JOIN api_keys ON users.id = api_keys.user_id
  `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ message: "DB error" });
        res.json(data);
    });
});

// Nonaktifkan API Key
router.put("/apikey/:id/deactivate", auth, isAdmin, (req, res) => {
    db.query(
        "UPDATE api_keys SET status='revoked' WHERE user_id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ message: "DB error" });
            res.json({ message: "API Key revoked" });
        }
    );
});
// HAPUS USER
router.delete("/users/:id", auth, isAdmin, (req, res) => {
    const userId = req.params.id;

    // Hapus data user dari tabel users
    db.query("DELETE FROM users WHERE id=?", [userId], (err, result) => {
        if (err) return res.status(500).json({ message: "DB error saat menghapus user" });
        res.json({ message: "User berhasil dihapus" });
    });
});



module.exports = router;
