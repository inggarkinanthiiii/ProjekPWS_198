import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const token = localStorage.getItem("token"); // dari login

  const [apiKey, setApiKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [endpoint, setEndpoint] = useState("/api/books");
  const [method, setMethod] = useState("GET");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Ambil API Key dari server saat dashboard dibuka
  useEffect(() => {
    fetch("http://localhost:5000/apikey/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.apiKey) {
          setApiKey(data.apiKey);
          localStorage.setItem("apiKey", data.apiKey);
        }
      });
  }, []);

  // Generate API Key
  const generateApiKey = async () => {
    const res = await fetch("http://localhost:5000/apikey/generate", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();
    setApiKey(data.apiKey);
    localStorage.setItem("apiKey", data.apiKey);
  };
  const copyApiKey = async () => {
    if (!apiKey) return;

    await navigator.clipboard.writeText(apiKey);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };


  const sendRequest = async () => {
    if (!apiKey) {
      alert("Generate API Key terlebih dahulu");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5000" + endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          font-family: "Segoe UI", Arial, sans-serif;
        }
        body { margin: 0; }
        .dashboard-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f1f5f9, #e5e7eb);
          padding: 40px 20px;
        }
        .dashboard-card {
          max-width: 900px;
          margin: auto;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          overflow: hidden;
        }
        .dashboard-header {
          background: #2563eb;
          padding: 28px;
          text-align: center;
          color: white;
        }
        .dashboard-header h2 { margin: 0; font-size: 24px; }
        .dashboard-header p { font-size: 14px; color: #dbeafe; margin-top: 6px; }
        .dashboard-content { padding: 30px; }
        .section { margin-bottom: 30px; }
        .section h3 { font-size: 16px; margin-bottom: 10px; color: #1e3a8a; }
        .apikey-box {
          background: #eef2ff;
          padding: 14px;
          border-radius: 10px;
          font-size: 14px;
          word-break: break-all;
        }
        .endpoint-list {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #e5e7eb;
        }
        .endpoint-item { font-family: monospace; margin-bottom: 6px; color: #111827; }
        .tester-box {
          display: grid;
          grid-template-columns: 1fr 3fr;
          gap: 12px;
          margin-bottom: 10px;
        }
        select, input {
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          font-size: 14px;
        }
        .send-btn {
          background: #2563eb;
          border: none;
          padding: 12px 20px;
          color: white;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
        }
        .send-btn:hover { background: #1d4ed8; }
        .response-box {
          background: #0f172a;
          color: #22c55e;
          padding: 16px;
          border-radius: 12px;
          margin-top: 14px;
          white-space: pre-wrap;
          font-family: monospace;
          font-size: 13px;
          max-height: 300px;
          overflow-y: auto;
        }
        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }
        .logout-btn {
          background: #ef4444;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          color: white;
          cursor: pointer;
        }
        .logout-btn:hover { background: #dc2626; }
        .back-link {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }
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


      <div className="dashboard-page">
        <div className="dashboard-card">
          <div className="dashboard-header">
            <h2>Apollo Open API – Developer Dashboard</h2>
            <p>Gunakan API Key untuk mengakses endpoint</p>
          </div>

          <div className="dashboard-content">

            {/* API KEY */}
            <div className="section">
              <h3>🔑 API Key Anda</h3>
              <div
                className="apikey-box"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <span>{apiKey || "Belum ada API Key"}</span>

                {apiKey && (
                  <button
                    onClick={copyApiKey}
                    style={{
                      background: copied ? "#22c55e" : "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>

              {!apiKey && (
                <button className="send-btn" onClick={generateApiKey}>
                  Generate API Key
                </button>
              )}

            </div>

            {/* ENDPOINT LIST */}
            <div className="section">
              <h3>📡 Daftar Endpoint</h3>
              <div className="endpoint-list">
                <div className="endpoint-item">GET  /api/books</div>
                <div className="endpoint-item">POST /api/books</div>
                <div className="endpoint-item">GET  /api/books/:id</div>
                <div className="endpoint-item">DELETE /api/books/:id</div>
              </div>
            </div>

            {/* API TESTER */}
            <div className="section">
              <h3>🧪 API Tester</h3>

              <div className="tester-box">
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option>GET</option>
                  <option>POST</option>
                  <option>DELETE</option>
                </select>

                <input
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="/api/books"
                />
              </div>

              <button className="send-btn" onClick={sendRequest}>
                {loading ? "Mengirim..." : "Send Request"}
              </button>

              {response && <div className="response-box">{response}</div>}
            </div>

            <div className="actions">
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <Link to="/" className="back-link">Kembali</Link>

                <Link
                  to="/daftarbuku"
                  className="back-link"
                  style={{
                    background: "#2563eb",
                    color: "white",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    fontWeight: "600"
                  }}
                >
                  📚 Lihat Daftar Buku
                </Link>

                <a
                  href="http://localhost:5000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="back-link"
                >
                  📘 API Documentation
                </a>
              </div>


              <button
                className="logout-btn"
                onClick={() => {
                  localStorage.clear();
                  window.location = "/login";
                }}
              >
                Logout
              </button>
            </div>


          </div>
        </div>

      </div>
      <div className="footer">
        © 2026 — Perpustakaan Apollo | Open API System
      </div>

    </>
  );
}
