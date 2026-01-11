import { useState } from "react";

function DaftarBuku() {
    const [apiKey, setApiKey] = useState("");
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const getBooks = async () => {
        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/books", {
                headers: { "x-api-key": apiKey }
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "API Key tidak valid");
                setBooks([]);
            } else {
                setBooks(data);
            }
        } catch (err) {
            setError("Gagal menghubungi server. Pastikan API berjalan.");
        } finally {
            setLoading(false);
        }
    };
    const pinjamBuku = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/books/${id}`, {
                method: "PUT",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: "unavailable" })
            });

            // update state lokal supaya UI langsung berubah
            setBooks(prev =>
                prev.map(b => b.id === id ? { ...b, status: "unavailable" } : b)
            );
        } catch (err) {
            console.error("Gagal meminjam buku:", err);
            alert("Gagal meminjam buku. Pastikan API berjalan.");
        }
    };


    return (
        <div className="page-container">
            <style>{`
.page-container {
  min-height: 100vh;
  background: #f0f2f5;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  display: flex;
  flex-direction: column;
}


.container {
  flex: 1;             /* ⬅️ INI KUNCI */
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;        /* penting untuk grid */
}


        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h1 {
          font-size: 2.5rem;
          color: #1a202c;
          margin-bottom: 8px;
        }

        /* Input Card Section */
        .auth-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .input-box {
          width: 100%;
          max-width: 450px;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 16px;
        }

        .btn-fetch {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          max-width: 450px;
          transition: 0.2s;
        }

        .btn-fetch:hover { background: #357abd; }

        /* Grid Layout */
        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 25px;
        }

        /* Modern Book Card */
        .book-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .book-card:hover {
          transform: translateY(-10px);
        }

        .cover-wrapper {
          width: 100%;
          height: 320px;
          background: #edf2f7;
          overflow: hidden;
          position: relative;
        }

        .book-cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .status-available { background: #48bb78; color: white; }
        .status-unavailable { background: #f56565; color: white; }

        .book-info {
          padding: 20px;
        }

        .book-id {
          font-size: 0.7rem;
          color: #a0aec0;
          text-transform: uppercase;
          margin-bottom: 5px;
          display: block;
        }

        .book-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 8px;
          line-height: 1.4;
          height: 3rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .book-author {
          color: #718096;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .book-footer {
          border-top: 1px solid #edf2f7;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #4a5568;
        }
          .pinjam-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.pinjam-btn:hover {
  background: #1d4ed8;
}

.pinjam-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}


        .year-tag {
          font-weight: 600;
          background: #ebf4ff;
          color: #3182ce;
          padding: 2px 8px;
          border-radius: 5px;
        }

        .error-msg { color: #e53e3e; font-size: 0.9rem; }
        .navbar {
  background: #1e3a8a;
  height: 80px;          /* tinggi navbar */
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}


.navbar h1 {
  margin: 0;
  font-size: 18px;
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.nav-links a:hover {
  text-decoration: underline;
}
.footer {
  background: #1e3a8a;
  height: 80px;   
  color: #c7d2fe;
  text-align: center;
  padding: 16px;
  font-size: 13px;
  margin-top: 40px;
}
      `}</style>

            <div className="navbar">
                <h1>📚 Apollo Open API</h1>

                <div className="nav-links">
                    <a href="/dashboard">Dashboard</a>
                    <a href="/daftarbuku">Daftar Buku</a>
                    <a href="http://localhost:5000/docs" target="_blank">API Docs</a>
                    <a href="/login">Logout</a>
                </div>
            </div>

            <div className="container">
                <header className="header">
                    <h1>📖 My Library</h1>
                    <p>Masukkan API Key untuk melihat koleksi buku terbaru</p>
                </header>

                <section className="auth-card">
                    <input
                        className="input-box"
                        type="password"
                        placeholder="Masukkan API Key Anda..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                    {error && <div className="error-msg">❌ {error}</div>}
                    <button className="btn-fetch" onClick={getBooks} disabled={loading || !apiKey}>
                        {loading ? "Sinkronisasi..." : "Ambil Data Buku"}
                    </button>
                </section>

                <div className="books-grid">
                    {books.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#a0aec0', padding: '50px' }}>
                            Belum ada data. Pastikan API Key benar dan server aktif.
                        </div>
                    ) : (
                        books.map((b) => (
                            <div className="book-card" key={b.id}>
                                <div className="cover-wrapper">
                                    <img
                                        src={b.cover ? `http://localhost:5000${b.cover}` : "https://via.placeholder.com/240x320?text=No+Cover"}
                                        alt={b.title}
                                        className="book-cover"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/240x320?text=Error+Loading"; }}
                                    />

                                    <span
                                        className={`status-badge ${b.status === "available" ? "status-available" : "status-unavailable"
                                            }`}
                                    >
                                        {b.status === "available" ? "Tersedia" : "Dipinjam"}
                                    </span>

                                </div>

                                <div className="book-info">
                                    <span className="book-id">SKU-{b.id}</span>
                                    <div className="book-title">{b.title}</div>
                                    <div className="book-author">Oleh: {b.author}</div>

                                    <div className="book-footer">
                                        <span className="year-tag">{b.year}</span>

                                        {b.status === "available" ? (
                                            <button className="pinjam-btn" onClick={() => pinjamBuku(b.id)}>
                                                Pinjam
                                            </button>
                                        ) : (
                                            <button className="pinjam-btn" disabled>
                                                Dipinjam
                                            </button>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="footer">
                © 2026 — Perpustakaan Apollo | Open API System
            </div>
        </div>

    );
}

export default DaftarBuku;