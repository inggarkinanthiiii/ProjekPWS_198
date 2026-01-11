import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({});
  const [apiKey, setApiKey] = useState("");

  const submit = () => {
    axios
      .post("http://localhost:5000/api/auth/register", form)
      .then((res) => setApiKey(res.data.apiKey));
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f1f5f9, #e5e7eb);
          padding: 16px;
        }

        .register-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          overflow: hidden;
        }

        .register-header {
          background: #2563eb;
          padding: 28px;
          text-align: center;
        }

        .register-header h2 {
          color: white;
          margin: 0;
          font-size: 22px;
          font-weight: 700;
        }

        .register-header p {
          color: #dbeafe;
          font-size: 14px;
          margin-top: 6px;
        }

        .register-content {
          padding: 32px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 6px;
          color: #374151;
        }

        .form-group input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          background: #f9fafb;
          font-size: 14px;
        }

        .form-group input:focus {
          outline: none;
          border-color: #2563eb;
          background: #ffffff;
        }

        .register-button {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: #2563eb;
          color: white;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.1s, background 0.2s;
          margin-top: 10px;
        }

        .register-button:hover {
          background: #1d4ed8;
        }

        .register-button:active {
          transform: scale(0.98);
        }

        .apikey-box {
          margin-top: 24px;
          padding: 16px;
          background: #f8fafc;
          border: 1px dashed #c7d2fe;
          border-radius: 12px;
        }

        .apikey-box h3 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #1e3a8a;
        }

        .apikey-box code {
          display: block;
          font-size: 13px;
          color: #111827;
          background: #eef2ff;
          padding: 10px;
          border-radius: 8px;
          word-break: break-all;
        }

        .login-link {
          text-align: center;
          margin-top: 22px;
          font-size: 14px;
          color: #4b5563;
        }

        .login-link a {
          color: #2563eb;
          font-weight: 700;
          text-decoration: none;
        }

        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="register-page">
        <div className="register-card">

          <div className="register-header">
            <h2>Register Developer</h2>
            <p>Buat akun untuk mendapatkan API Key</p>
          </div>

          <div className="register-content">
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input
                placeholder="Nama Anda"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="email@domain.com"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <button className="register-button" onClick={submit}>
              Daftar Sekarang
            </button>

            {apiKey && (
              <div className="apikey-box">
                <h3>API Key Anda</h3>
                <code>{apiKey}</code>
              </div>
            )}

            <div className="login-link">
              Sudah punya akun?{" "}
              <Link to="/login">Login di sini</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
