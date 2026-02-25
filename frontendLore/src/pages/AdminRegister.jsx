import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!name || !email || !storeName || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        storeName
      });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("storeSlug", res.data.store.slug);

      navigate(`/${res.data.store.slug}`);

    } catch (err) {
      setError(err.response?.data?.error || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminLogin-container">
      <h1>Crear Cuenta</h1>

      <form onSubmit={submit}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          placeholder="Nombre de tu tienda"
          value={storeName}
          onChange={e => setStoreName(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Cuenta"}
        </button>
      </form>
    </div>
  );
}