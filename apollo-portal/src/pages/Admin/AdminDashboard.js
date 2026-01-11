import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
        fetchBooks();
    }, []);

    // FETCH USER DATA
    const fetchUsers = () => {
        setLoading(true);
        axios
            .get("http://localhost:5000/api/admin/users", {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") },
            })
            .then((res) => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    // FETCH BOOK DATA
    const fetchBooks = () => {
        axios
            .get("http://localhost:5000/api/books")
            .then((res) => setBooks(res.data))
            .catch((err) => console.error(err));
    };

    // REVOKE API KEY
    const revokeApiKey = (userId) => {
        axios
            .put(
                `http://localhost:5000/api/admin/apikey/${userId}/deactivate`,
                {},
                { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
            )
            .then(() => fetchUsers())
            .catch((err) => console.error(err.response || err));
    };

    // DELETE USER
    const deleteUser = (userId) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            axios
                .delete(`http://localhost:5000/api/admin/users/${userId}`, {
                    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
                })
                .then(() => fetchUsers())
                .catch((err) => console.error(err.response || err));
        }
    };

    // DETAIL USER
    const detailUser = (user) => {
        alert(`Detail User:
ID: ${user.id}
Nama: ${user.name}
Email: ${user.email}
Role: ${user.role}
API Key: ${user.api_key || "Belum dibuat"}
Status: ${user.status || "User"}`);
    };

    return (
        <div className="app-shell">
            <style>{`
                * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
                .app-shell { display: flex; flex-direction: column; min-height: 100vh; background: #f1f5f9; }
                .navbar { background: #ffffff; padding: 0 5%; height: 70px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 1000; }
                .nav-logo { font-size: 1.5rem; font-weight: 800; color: #4f46e5; text-decoration: none; }
                .nav-link { text-decoration: none; font-weight: 600; color: #64748b; margin-left: 20px; }
                .active-admin { color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 5px; }
                .main-content { flex: 1; padding: 40px 5%; max-width: 1200px; margin: 0 auto; width: 100%; }
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
                .stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; }
                .stat-card h4 { color: #64748b; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 10px; }
                .stat-card p { font-size: 1.8rem; font-weight: 800; color: #1e293b; }
                .table-container { background: white; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e2e8f0; margin-top: 20px; }
                .table-header { padding: 20px 25px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                table { width: 100%; border-collapse: collapse; text-align: left; }
                th { background: #f8fafc; padding: 15px 25px; font-size: 0.85rem; color: #475569; font-weight: 700; text-transform: uppercase; }
                td { padding: 18px 25px; font-size: 0.9rem; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
                tr:hover { background: #f8fafc; }
                .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
                .badge-active { background: #dcfce7; color: #15803d; }
                .badge-pending { background: #fef9c3; color: #854d0e; }
                .api-key-text { font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; color: #475569; font-size: 0.8rem; }
                .action-btn { padding: 6px 12px; border-radius: 6px; border: none; font-weight: 600; cursor: pointer; margin-right: 6px; }
                .revoke-btn { background: #ef4444; color: white; }
                .delete-btn { background: #f97316; color: white; }
                .detail-btn { background: #3b82f6; color: white; }
                .footer { background: #1e293b; color: #f8fafc; padding: 30px 5%; text-align: center; margin-top: auto; }
            `}</style>

            {/* NAVBAR */}
            <nav className="navbar">
                <Link to="/" className="nav-logo">🚀 Apollo Admin</Link>
                <div>
                    <Link to="/admin" className="nav-link active-admin">Dashboard</Link>
                    <Link to="/kelolabuku" className="nav-link">Kelola Buku</Link>
                </div>
            </nav>

            {/* CONTENT */}
            <main className="main-content">
                <header style={{ marginBottom: "30px" }}>
                    <h2 style={{ color: "#1e293b", fontSize: "1.8rem" }}>Manajemen Pengguna</h2>
                    <p style={{ color: "#64748b" }}>Pantau penggunaan API Key dan aktivitas seluruh member.</p>
                </header>

                {/* STATS */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h4>Total Pengguna</h4>
                        <p>{users.length}</p>
                    </div>
                    <div className="stat-card">
                        <h4>API Key Aktif</h4>
                        <p>{users.filter(u => u.api_key).length}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Total Buku</h4>
                        <p>{books.length}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Server Status</h4>
                        <p style={{ color: "#10b981" }}>Online</p>
                    </div>
                </div>

                {/* TABLE USER */}
                <div className="table-container">
                    <div className="table-header">
                        <h3 style={{ fontSize: "1.1rem" }}>Daftar User & API Access</h3>
                        <button
                            onClick={fetchUsers}
                            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontWeight: "600" }}
                        >
                            🔄 Refresh Data
                        </button>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nama Pengguna</th>
                                    <th>Email Address</th>
                                    <th>API Key Access</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>Memuat data...</td></tr>
                                ) : users.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>Tidak ada pengguna ditemukan.</td></tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u.id}>
                                            <td>
                                                <div style={{ fontWeight: "700" }}>{u.name}</div>
                                                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>ID: {u.id}</div>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                {u.api_key ? (
                                                    <span className="api-key-text">{u.api_key}</span>
                                                ) : (
                                                    <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>Belum dibuat</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`badge ${u.status === 'active' ? 'badge-active' : 'badge-pending'}`}>
                                                    {u.status || "User"}
                                                </span>
                                            </td>
                                            <td>
                                                {u.api_key && <button className="action-btn revoke-btn" onClick={() => revokeApiKey(u.id)}>Revoke</button>}
                                                <button className="action-btn delete-btn" onClick={() => deleteUser(u.id)}>Hapus</button>
                                                <button className="action-btn detail-btn" onClick={() => detailUser(u)}>Detail</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="footer">
                <p>&copy; 2026 Apollo Admin System • Internal Purpose Only</p>
            </footer>
        </div>
    );
}
