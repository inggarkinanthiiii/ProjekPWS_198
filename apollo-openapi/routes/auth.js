const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API untuk registrasi dan login
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin Apollo
 *               email:
 *                 type: string
 *                 example: admin@apollo.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: User berhasil terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   example: 06804101-e85d-4c83-a078-80da39b39b8d
 */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash],
      (err) => {
        if (err) return res.status(500).json({ message: "Database error" });

        // ❌ JANGAN buat API key di sini
        res.json({ message: "Register success" });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user/admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@apollo.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 apiKey:
 *                   type: string
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, users) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (users.length === 0) return res.status(401).json({ message: "User not found" });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Wrong password" });

    db.query("SELECT api_key FROM api_keys WHERE user_id=?", [user.id], (err2, keys) => {
      if (err2) return res.status(500).json({ message: "Database error" });
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "8h",
      });
      res.json({
        token,
        hasApiKey: keys.length > 0,
        role: user.role
      });
      router.post("/generate-key", (req, res) => {
        const userId = req.user.id;   // dari JWT middleware
        const apiKey = uuidv4();

        db.query(
          "INSERT INTO api_keys (user_id, api_key, status) VALUES (?, ?, 'active')",
          [userId, apiKey],
          (err) => {
            if (err) return res.status(500).json({ message: "Database error" });

            res.json({ apiKey });
          }
        );
      });


    });
  });
});

module.exports = router;
