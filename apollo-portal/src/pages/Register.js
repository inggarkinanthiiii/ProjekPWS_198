import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const submit = () => {
    axios
      .post("http://localhost:5000/api/auth/register", form)
      .then(() => {
        setMessage("Registrasi berhasil. Silakan login.");
        setTimeout(() => {
          navigate("/login"); // redirect ke login
        }, 1500);
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || "Register gagal");
      });
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
          margin-top: 10px;
        }

        .register-button:hover {
          background: #1d4ed8;
        }

        .message {
          margin-top: 16px;
          text-align: center;
          font-size: 14px;
          color: #2563eb;
          font-weight: 600;
        }

        .login-link {
          text-align: center;
          margin-top: 22px;
          font-size: 14px;
        }
      `}</style>

      <div className="register-page">
        <div className="register-card">
          <div className="register-header">
            <h2>Register Developer</h2>
            <p>Buat akun untuk menggunakan Apollo Open API</p>
          </div>

          <div className="register-content">
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>

            <button className="register-button" onClick={submit}>
              Daftar
            </button>

            {message && <div className="message">{message}</div>}

            <div className="login-link">
              Sudah punya akun? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
