import { useState } from "react";
import api from "../api/axios";

export default function ProductList({ products, editingProduct, setEditingProduct, setConfirmData }) {
    const [searchProduct, setSearchProduct] = useState("");

    return (
        <section className="admin-section">
            <h2>Productos</h2>
            <input
                className="admin-search"
                placeholder="Buscar producto..."
                value={searchProduct}
                onChange={e => setSearchProduct(e.target.value)}
            />
            <div className="products-admin-list">
                {products
                    .filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase()))
                    .map(p => (
                        <div
                            key={p._id}
                            className={`admin-card ${editingProduct?._id === p._id ? "active-edit" : ""}`}
                        >
                            <span>{p.name} - ${p.price}</span>
                            <div className="admin-card-btn">
                                <button onClick={() => setEditingProduct(p)}>Editar</button>
                                <button
                                    onClick={() =>
                                        setConfirmData({
                                        type: "product",
                                        id: p._id,
                                        name: p.name
                                        })
                                    }
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
}
