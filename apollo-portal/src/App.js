import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DaftarBuku from "./pages/daftarbuku";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminKelolaBuku from "./pages/Admin/AdminKelolaBuku";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />   {/* INI YANG KURANG */}
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/daftarbuku" element={<DaftarBuku/>}/>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/kelolabuku" element={<AdminKelolaBuku />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
