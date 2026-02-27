import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Mi Plataforma de Tiendas</h1>
        <p style={styles.subtitle}>
          Crea y administra tu tienda online fácilmente.
        </p>

        <div style={styles.buttonContainer}>
          <button
            style={styles.primaryButton}
            onClick={() => navigate("/admin")}
          >
            Iniciar Sesión
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/admin/register")}
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "400px",
  },
  title: {
    marginBottom: "10px",
  },
  subtitle: {
    marginBottom: "30px",
    color: "#555",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  primaryButton: {
    padding: "12px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondaryButton: {
    padding: "12px",
    backgroundColor: "white",
    color: "#2563eb",
    border: "2px solid #2563eb",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};