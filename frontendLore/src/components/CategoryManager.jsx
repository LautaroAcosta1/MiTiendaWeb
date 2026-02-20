import { useState } from "react";
import api from "../api/axios";

export default function CategoryManager({ categories, setConfirmData, load }) {
    const [newCategory, setNewCategory] = useState("");

    const createCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            await api.post("/categories", { name: newCategory });
            setNewCategory("");
            load();
        } catch (err) {
            
        }
    };

    return (
        <section className="admin-section">
            <h2>Categorías</h2>
            <div className="category-admin">
                <input
                    placeholder="Nueva categoría"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                />
                <button onClick={createCategory}>Agregar</button>
            </div>
            <div className="categories-list">
                {categories.map(c => (
                    <div key={c._id} className="category-row">
                        <span>{c.name}</span>
                        <button
                            onClick={() =>
                                setConfirmData({
                                type: "category",
                                id: c._id,
                                name: c.name
                                })
                            }
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
