import { useEffect, useState } from "react";
import api from "../api/axios";

export default function StoreSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // 🔹 Cargar configuración actual
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/store/settings");
        setWhatsappNumber(res.data.whatsappNumber || "");
        setWhatsappMessage(res.data.whatsappMessage || "");
      } catch (err) {
        setError("Error cargando configuración.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 🔹 Guardar cambios
  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      await api.put("/store/settings", {
        whatsappNumber,
        whatsappMessage,
      });

      setSuccess("Configuración guardada correctamente.");
    } catch (err) {
      setError("Error guardando configuración.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando configuración...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2>Configuración de la Tienda</h2>

      <form onSubmit={handleSave}>
        <div style={{ marginBottom: "20px" }}>
          <label>Número de WhatsApp</label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="5491123456789"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Mensaje por defecto</label>
          <textarea
            value={whatsappMessage}
            onChange={(e) => setWhatsappMessage(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "10px 20px",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}