import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    axios
      .post("http://localhost:5000/api/auth/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        if (res.data.role === "admin") {
          window.location = "/admin";
        } else {
          window.location = "/dashboard";
        }
      })

      .catch(() => {
        alert("Email atau password salah");
      });
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f1f5f9, #e5e7eb);
          padding: 16px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          overflow: hidden;
        }

        .login-header {
          background: #2563eb;
          padding: 28px;
          text-align: center;
        }

        .login-header h2 {
          color: white;
          margin: 0;
          font-size: 22px;
          font-weight: 700;
        }

        .login-header p {
          color: #dbeafe;
          font-size: 14px;
          margin-top: 6px;
        }

        .login-content {
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

        .login-button {
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
          margin-top: 6px;
        }

        .login-button:hover {
          background: #1d4ed8;
        }

        .login-button:active {
          transform: scale(0.98);
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 26px 0;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .divider span {
          margin: 0 10px;
          font-size: 12px;
          color: #9ca3af;
        }

        .register-text {
          text-align: center;
          font-size: 14px;
          color: #4b5563;
        }

        .register-text a {
          color: #2563eb;
          font-weight: 700;
          text-decoration: none;
        }

        .register-text a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <h2>Login Developer</h2>
            <p>Masuk untuk mengakses dashboard</p>
          </div>

          <div className="login-content">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="email@domain.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="login-button" onClick={login}>
              Login
            </button>

            <div className="divider">
              <span>atau</span>
            </div>

            <p className="register-text">
              Belum punya akun?{" "}
              <Link to="/register">Daftar di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
