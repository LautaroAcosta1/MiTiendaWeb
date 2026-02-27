import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "./Admin.css";
import CategoryManager from "../components/CategoryManager";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { slug } = useParams();

  const slugStore = localStorage.getItem("storeSlug");

  useEffect(() => {
    load();
  }, []);

  const handleConfirmDelete = async () => {
    if (!confirmData) return;

    try {
      if (confirmData.type === "product") {
        await api.delete(`/products/${confirmData.id}`);
      } else {
        await api.delete(`/categories/${confirmData.id}`);
      }

      setConfirmData(null);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const load = async () => {
    try {
      setError(null);
      const [resProducts, resCategories] = await Promise.all([
        api.get("/products"),
        api.get("/categories")
      ]);
      setProducts(resProducts.data);
      setCategories(resCategories.data);
    } catch (err) {
      console.error(err);
      setError("Error de conexión al cargar datos.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate(`/admin`);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* ================== TOP ==================== */}
        <div className="admin-top">
          <h1>Panel Admin</h1>
          <div className="btn-group">
            <button className="catalog-btn" onClick={() => navigate(`/${slugStore}`)}>
              Ir al Catálogo
            </button>
            <button className="logout-btn" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* ===================== LOADING / ERROR ================= */}
        {loading ? (
          <p>Cargando datos del panel...</p>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={load}>Reintentar</button>
          </div>
        ) : (
          /* ======================= GRID ==================== */
          <div className="admin-grid">
            <CategoryManager
              categories={categories}
              setConfirmData={setConfirmData}
              load={load}
            />

            <ProductForm
              categories={categories}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              load={load}
            />

            <ProductList
              products={products}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              setConfirmData={setConfirmData}
            />
          </div>
        )}
      </div>
      {confirmData && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Seguro que querés eliminar{" "}
              <strong>{confirmData.name}</strong>?
            </p>

            <div className="confirm-actions">
              <button
                className="cancel-btn"
                onClick={() => setConfirmData(null)}
              >
                Cancelar
              </button>

              <button
                className="delete-btn"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
