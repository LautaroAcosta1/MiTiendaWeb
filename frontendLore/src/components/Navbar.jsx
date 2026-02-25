import "./Navbar.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ search, setSearch, cartCount, toggleCart }) {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-logo">TiendaLore</div>

      <div className="group">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
          <g>
            <path
              d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
            ></path>
          </g>
        </svg>
        <input className="input"
          type="search"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      

        <div className="btn-group-nav">

          {isAuthenticated && (
            <Link to={`/${slug}/admin/panel`} className="admin-btn">
              <i className="fi fi-sr-settings"></i>
            </Link>
          )}

          <div className="nav-actions">
            <div className="nav-cart">
                <span>{cartCount}</span>
            </div>

            <button className="nav-burger" onClick={toggleCart}>
              <i className="fi fi-sr-shopping-cart"></i>
            </button>
          </div>

        </div>
        
    </nav>
  );
}

