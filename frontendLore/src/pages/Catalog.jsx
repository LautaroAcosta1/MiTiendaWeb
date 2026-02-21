import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./Catalog.css";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [cartOpen, setCartOpen] = useState(false);


  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/products"),
      api.get("/categories")
    ])
      .then(([resProducts, resCategories]) => {
        setProducts(resProducts.data);
        setCategories(resCategories.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Error cargando el catálogo. Inténtalo más tarde.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  const filteredProducts = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "all" || p.category?._id === category;

    return matchSearch && matchCategory;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(p => p._id === product._id);

      if (found) {
        return prev.map(p =>
          p._id === product._id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(p => p._id !== id));
  };

  const total = Array.isArray(cart)
    ? cart.reduce((acc, p) => acc + p.price * p.qty, 0)
    : 0;


  const whatsappMessage = encodeURIComponent(
    cart.map(p => `• ${p.name} x${p.qty} - $${p.price * p.qty}`).join("\n") +
    `\n\nTotal: $${total}`
  );

  const buyWhatsapp = () => {
    if (cart.length === 0) return;

    const url = `https://wa.me/5491167632352?text=${whatsappMessage}`;
    window.open(url, "_blank");
  };






  return (
    <>
      <Navbar
        search={search}
        setSearch={setSearch}
        cartCount={cart.reduce((a, b) => a + b.qty, 0)}
        toggleCart={() => setCartOpen(o => !o)}
      />



      <div className="container">
        <header className="header">
          <div className="categories-bar">
            {loading ? (
              <span className="loading-text">Cargando categorías...</span>
            ) : error ? (
              <span className="error-text">No se pudieron cargar las categorías</span>
            ) : (
              <>
                <button
                  className={`cat-btn ${category === "all" ? "active" : ""}`}
                  onClick={() => setCategory("all")}
                >
                  Todo
                </button>

                {categories.map(c => (
                  <button
                    key={c._id}
                    className={`cat-btn ${category === c._id ? "active" : ""}`}
                    onClick={() => setCategory(c._id)}
                  >
                    {c.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </header>

        {cartOpen && (
          <div className="cart-overlay" onClick={() => setCartOpen(false)} />
        )}


        <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
          <div className="cart-header">
            <h3>Mi pedido</h3>
            <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
          </div>

          <div className="cart-list">
            {cart.length === 0 &&
              <div className="empty">
                <i className="fi fi-rr-shopping-cart"></i>
                <h6>Carrito vacío.</h6>
              </div>
            }

            {cart.map(p => (
              <div key={p._id} className="cart-item">
                <span>{p.name} x{p.qty}</span>
                <button className="cart-remove" onClick={() => removeFromCart(p._id)}>✕</button>
              </div>
            ))}
          </div>


          <div className="cart-total">Total: ${total}</div>

          {cart.length > 0 && (
            <button className="cart-btn" onClick={buyWhatsapp}>
              <span>Comprar por WhatsApp</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 74 74"
                height="34"
                width="34"
              >
                <circle strokeWidth="3" stroke="black" r="35.5" cy="37" cx="37"></circle>
                <path
                  fill="black"
                  d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
                ></path>
              </svg>
            </button>
          )}
        </div>



        {loading ? (
          <div className="loading-container">
            <h3>Cargando productos...</h3>
          </div>
        ) : error ? (
          <div className="error-container">
            <h3>{error}</h3>
          </div>
        ) : (
          <div className="grid">
            {filteredProducts.map(p => (
              <div key={p._id} className="card">
                <div className="img-wrap">
                  <img src={p.image} />
                </div>

                <div className="card-body">
                  <h2>{p.name}</h2>

                  <p>{p.description}</p>

                  <div className="price-box">
                    {p.oldPrice && (
                      <span className="old-price">
                        ${p.oldPrice}
                      </span>
                    )}
                    <span className="current-price">
                      ${p.price}
                    </span>
                  </div>
                </div>

                <button className="btn" onClick={() => addToCart(p)}>
                  Agregar
                </button>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="empty-catalog">
                No se encontraron productos.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
