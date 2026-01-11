const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// middleware
const apiKey = require("../middleware/apiKey");   // untuk developer
const auth = require("../middleware/auth");       // JWT
const isAdmin = require("../middleware/isAdmin"); // role admin

// Middleware untuk akses buku: admin, user, developer
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const accessBooks = (req, res, next) => {
  if (req.headers.authorization) {
    // ada JWT → cek user / admin
    return auth(req, res, next);
  } else if (req.headers["x-api-key"]) {
    // ada API key → untuk developer
    return apiKey(req, res, next);
  } else {
    // user biasa tanpa JWT/API key
    req.user = { role: "user" };
    next();
  }
};

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
router.get("/", accessBooks, (req, res) => {
  db.query("SELECT * FROM books", (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(data);
  });
});


/**
 * POST buku baru
 * - Hanya admin & developer
 */
// POST buku baru + upload cover
router.post("/", upload.single("cover"), (req, res) => {
  const { title, author, year, status = "available" } = req.body;
  const cover = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    "INSERT INTO books (title, author, year, status, cover) VALUES (?, ?, ?, ?, ?)",
    [title, author, year, status, cover],
    (err) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json({ message: "Book added", cover });
    }
  );
});


router.put("/:id", upload.single("cover"), (req, res) => {
  const { title, author, year, status } = req.body;
  const cover = req.file ? `/uploads/${req.file.filename}` : undefined;

  const sql = cover
    ? "UPDATE books SET title=?, author=?, year=?, status=?, cover=? WHERE id=?"
    : "UPDATE books SET title=?, author=?, year=?, status=? WHERE id=?";

  const params = cover
    ? [title, author, year, status, cover, req.params.id]
    : [title, author, year, status, req.params.id];

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json({ message: "Book updated", cover });
  });
});


router.delete("/:id", (req, res) => {
  db.query("DELETE FROM books WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json({ message: "Book deleted" });
  });
});

module.exports = router;