import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();

    const res = await api.post("/auth/login", {
      username,
      password
    });

    localStorage.setItem("token", res.data.token);
    navigate("/admin/panel");
  };

  return (
    <div className="adminLogin-container">
      <h1>Admin Login</h1>

      <form onSubmit={submit}>
        <input
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button>Entrar</button>
      </form>
    </div>
  );
}
