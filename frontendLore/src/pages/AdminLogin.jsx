import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Admin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      const { token, store } = res.data;

      // guardamos usando el contexto (no localStorage directo)
      login(token, { store });

      localStorage.setItem("storeSlug", store.slug);

      navigate(`/${store.slug}/admin/panel`);
    } catch (error) {
      console.error("Login error:", error);
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="admin-page">
      <div className="adminLogin-container">
        <h1>Admin Login</h1>

        <form onSubmit={submit}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Entrar</button>

          <p style={{ marginTop: "15px" }}>
            ¿No tienes cuenta?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/admin/register")}
            >
              Crear cuenta
            </span>
          </p>
        </form>
      </div>
    </div>

  );
}