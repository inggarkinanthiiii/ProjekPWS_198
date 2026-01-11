const express = require("express");
const router = express.Router();
const db = require("../db");
const apiKey = require("../middleware/apiKey");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API untuk manajemen buku
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Mendapatkan daftar semua buku
 *     tags: [Books]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   status:
 *                     type: string
 *                     example: available
 */

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Menambahkan buku baru
 *     tags: [Books]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Laskar Pelangi
 *               author:
 *                 type: string
 *                 example: Andrea Hirata
 *               year:
 *                 type: integer
 *                 example: 2005
 *               status:
 *                 type: string
 *                 example: available
 *     responses:
 *       200:
 *         description: Buku berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Book added
 */

router.get("/", apiKey, (req, res) => {
  db.query("SELECT * FROM books", (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(data);
  });
});

router.post("/", apiKey, (req, res) => {
  const { title, author, year, status = "available" } = req.body;
  db.query(
    "INSERT INTO books (title, author, year, status) VALUES (?, ?, ?, ?)",
    [title, author, year, status],
    (err) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json({ message: "Book added" });
    }
  );
});

module.exports = router;
