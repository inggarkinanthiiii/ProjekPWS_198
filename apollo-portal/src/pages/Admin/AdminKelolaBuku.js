import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminKelolaBuku() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ open: false, type: "", book: {} });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = () => {
        setLoading(true);
        axios
            .get("http://localhost:5000/api/books")
            .then((res) => {
                setBooks(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const deleteBook = (id) => {
        if (!window.confirm("🚨 Hapus buku ini secara permanen?")) return;
        axios
            .delete(`http://localhost:5000/api/books/${id}`)
            .then(() => fetchBooks())
            .catch((err) => console.log(err));
    };

    const toggleStatus = (book) => {
        const newStatus = book.status === "available" ? "unavailable" : "available";
        axios
            .put(`http://localhost:5000/api/books/${book.id}`, { ...book, status: newStatus })
            .then(() => fetchBooks())
            .catch((err) => console.log(err));
    };

    const openModal = (type, book = {}) => setModal({ open: true, type, book });
    const closeModal = () => setModal({ open: false, type: "", book: {} });

    const saveBook = (formData, id) => {
        const apiCall = id
            ? axios.put(`http://localhost:5000/api/books/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            : axios.post("http://localhost:5000/api/books", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

        apiCall
            .then(() => {
                fetchBooks();
                closeModal();
            })
            .catch(() => alert("Terjadi kesalahan saat menyimpan data. Pastikan server berjalan."));
    };

    return (
        <div className="app-shell">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background-color: #f8fafc; color: #1e293b; }
        
        .app-shell { display: flex; flex-direction: column; min-height: 100vh; }

        /* Navbar Modern */
        .navbar { 
          background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px);
          padding: 0 5%; height: 75px; display: flex; justify-content: space-between; 
          align-items: center; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 100;
        }
        .nav-logo { font-size: 1.4rem; font-weight: 800; color: #4f46e5; text-decoration: none; letter-spacing: -0.5px; }
        .nav-link { text-decoration: none; font-weight: 600; color: #64748b; margin-left: 24px; transition: 0.2s; }
        .nav-link:hover { color: #4f46e5; }
        .active-page { color: #4f46e5; position: relative; }
        .active-page::after { content: ''; position: absolute; bottom: -26px; left: 0; width: 100%; height: 3px; background: #4f46e5; border-radius: 10px 10px 0 0; }

        /* Content Area */
        .main-content { flex: 1; padding: 40px 5%; max-width: 1300px; margin: 0 auto; width: 100%; }
        .header-box { display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; }
        
        /* Table Style */
        .table-card { background: white; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.03); }
        table { width: 100%; border-collapse: collapse; }
        th { background: #fcfcfd; padding: 18px 24px; text-align: left; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; border-bottom: 1px solid #f1f5f9; }
        td { padding: 16px 24px; border-bottom: 1px solid #f8fafc; font-size: 0.95rem; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background-color: #fbfbfe; }
        
        /* Badge Status */
        .badge { padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; }
        .bg-available { background: #ecfdf5; color: #059669; }
        .bg-unavailable { background: #fff1f2; color: #e11d48; }

        /* Action Buttons */
        .btn { padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; transition: 0.2s; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 8px; }
        .btn-add { background: #4f46e5; color: white; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); }
        .btn-add:hover { background: #4338ca; transform: translateY(-1px); }
        .btn-action { padding: 8px 12px; border-radius: 10px; color: white; margin-right: 6px; }
        .btn-action:hover { opacity: 0.9; transform: scale(1.05); }

        /* Modal Layout */
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s ease; }
        .modal-content { background: white; padding: 40px; border-radius: 24px; width: 100%; max-width: 500px; position: relative; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 0.9rem; font-weight: 700; color: #334155; margin-bottom: 8px; }
        input, select { width: 100%; padding: 12px 16px; border: 2px solid #f1f5f9; border-radius: 12px; font-size: 0.95rem; transition: 0.2s; }
        input:focus { border-color: #4f46e5; outline: none; background: #fff; }

        /* Custom File Upload */
        .file-input-wrapper { border: 2px dashed #e2e8f0; padding: 20px; border-radius: 16px; text-align: center; cursor: pointer; transition: 0.2s; }
        .file-input-wrapper:hover { border-color: #4f46e5; background: #f5f3ff; }

        .footer { padding: 40px; text-align: center; color: #94a3b8; font-size: 0.9rem; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

            <nav className="navbar">
                <Link to="/" className="nav-logo">🚀 Apollo Admin</Link>
                <div>
                    <Link to="/admin" className="nav-link">Dashboard</Link>
                    <Link to="/admin/kelola-buku" className="nav-link active-page">Kelola Buku</Link>
                </div>
            </nav>

            <main className="main-content">
                <div className="header-box">
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Katalog Perpustakaan</h1>
                        <p style={{ color: "#64748b", marginTop: '4px' }}>Manajemen inventaris buku dan kontrol akses.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn" style={{ background: '#fff', border: '1px solid #e2e8f0' }} onClick={fetchBooks}>🔄</button>
                        <button className="btn btn-add" onClick={() => openModal("Tambah")}>+ Tambah Buku Baru</button>
                    </div>
                </div>

                <div className="table-card">
                    <table>
                        <thead>
                            <tr>
                                <th>Info Buku</th>
                                <th>Tahun</th>
                                <th>Status Kontrol</th>
                                <th>Tindakan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>Sinkronisasi Database...</td></tr>
                            ) : books.map((b) => (
                                <tr key={b.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <img src={b.cover ? `http://localhost:5000${b.cover}` : "https://via.placeholder.com/40x60"} alt="" style={{ width: '48px', height: '68px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                            <div>
                                                <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}>{b.title}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{b.author}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span style={{ fontWeight: '700', color: '#475569' }}>{b.year}</span></td>
                                    <td>
                                        <span className={`badge ${b.status === 'available' ? 'bg-available' : 'bg-unavailable'}`}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex' }}>
                                            <button className="btn btn-action" title="Toggle Status" style={{ background: '#f1f5f9', color: '#475569' }} onClick={() => toggleStatus(b)}>🔄</button>
                                            <button className="btn btn-action" title="Detail" style={{ background: '#4f46e5' }} onClick={() => openModal("Detail", b)}>👁️</button>
                                            <button className="btn btn-action" title="Edit" style={{ background: '#f59e0b' }} onClick={() => openModal("Edit", b)}>✏️</button>
                                            <button className="btn btn-action" title="Hapus" style={{ background: '#ef4444' }} onClick={() => deleteBook(b.id)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* MODAL SYSTEM */}
            {modal.open && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={closeModal} style={{ position: 'absolute', top: '25px', right: '25px', background: '#f1f5f9', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '25px', color: '#1e293b' }}>{modal.type} Buku</h3>

                        {modal.type === "Detail" ? (
                            <div style={{ textAlign: 'center' }}>
                                <img src={modal.book.cover ? `http://localhost:5000${modal.book.cover}` : "https://via.placeholder.com/180x250"} alt="" style={{ width: '180px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{modal.book.title}</h2>
                                <p style={{ color: '#64748b', margin: '8px 0 20px 0', fontSize: '1.1rem' }}>{modal.book.author} • {modal.book.year}</p>
                                <span className={`badge ${modal.book.status === 'available' ? 'bg-available' : 'bg-unavailable'}`} style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                                    Status: {modal.book.status}
                                </span>
                            </div>
                        ) : (
                            <BookForm book={modal.book} onSave={saveBook} onCancel={closeModal} />
                        )}
                    </div>
                </div>
            )}

            <footer className="footer">
                <p>© 2026 Apollo Admin Console. All rights reserved.</p>
            </footer>
        </div>
    );
}

function BookForm({ book = {}, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title: book.title || "",
        author: book.author || "",
        year: book.year || "",
        status: book.status || "available",
        coverFile: null,
        coverPreview: book.cover || "",
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, coverFile: file, coverPreview: URL.createObjectURL(file) }));
        }
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData();
            data.append("title", formData.title);
            data.append("author", formData.author);
            data.append("year", formData.year);
            data.append("status", formData.status);
            if (formData.coverFile) data.append("cover", formData.coverFile);
            onSave(data, book.id);
        }}>
            <div className="form-group">
                <label>Informasi Utama</label>
                <input name="title" value={formData.title} onChange={handleChange} required placeholder="Judul Buku" style={{ marginBottom: '10px' }} />
                <input name="author" value={formData.author} onChange={handleChange} required placeholder="Nama Penulis" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="form-group">
                <div>
                    <label>Tahun</label>
                    <input name="year" type="number" value={formData.year} onChange={handleChange} required />
                </div>
                <div>
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="available">Tersedia</option>
                        <option value="unavailable">Dipinjam</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Media Cover</label>
                <div className="file-input-wrapper" onClick={() => document.getElementById('fileInput').click()}>
                    {formData.coverPreview ? (
                        <img src={formData.coverPreview} alt="Preview" style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                        <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                            <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '5px' }}>📁</span>
                            Klik untuk pilih gambar cover
                        </div>
                    )}
                    <input id="fileInput" type="file" hidden accept="image/*" onChange={handleFileChange} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                <button type="submit" className="btn btn-add" style={{ flex: 1, justifyContent: 'center' }}>Simpan Data</button>
                <button type="button" className="btn" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }} onClick={onCancel}>Batal</button>
            </div>
        </form>
    );
}