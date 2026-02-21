import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ProductForm({ categories, editingProduct, setEditingProduct, load }) {
    const [form, setForm] = useState({
        name: "",
        oldPrice: "",
        price: "",
        image: null,
        description: "",
        stock: "",
        category: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editingProduct) {
            setForm({
                name: editingProduct.name,
                oldPrice: editingProduct.oldPrice,
                price: editingProduct.price,
                description: editingProduct.description,
                stock: editingProduct.stock,
                category: editingProduct.category?._id || "",
                image: null,
            });
            setError(null);
        } else {
            resetForm();
        }
    }, [editingProduct]);

    const resetForm = () => {
        setForm({
            name: "",
            oldPrice: "",
            price: "",
            image: null,
            description: "",
            stock: "",
            category: ""
        });
        setError(null);
    };

    const cancelEdit = () => {
        setEditingProduct(null);
    };

    const submit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!editingProduct && !form.image) {
            setError("Seleccioná una imagen");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("name", form.name);
        // campo opcional
        if (form.oldPrice && Number(form.oldPrice) > Number(form.price)) {
            data.append("oldPrice", form.oldPrice);
        }
        data.append("price", form.price);
        data.append("description", form.description);
        data.append("stock", form.stock);
        data.append("category", form.category);

        if (form.image) {
            data.append("image", form.image);
        }

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, data);
            } else {
                await api.post("/products", data);
            }
            setEditingProduct(null);
            load();
        } catch (err) {
            console.error(err);
            setError("Error guardando el producto. Verifique los datos o inténtelo de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="admin-section">
            <h2>{editingProduct ? "Editar producto" : "Crear producto"}</h2>
            {error && <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
            <form onSubmit={submit} className="admin-form">
                <div className="input-group">
                    <input
                        placeholder="Nombre"
                        value={form.name}
                        maxLength={40}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        required
                    />
                    <small>
                        {form.name.length}/40
                    </small>
                </div>
                <div className="input-group">
                    <input
                        placeholder="Descripción (opcional)"
                        value={form.description}
                        maxLength={100}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    /> 
                    <small>
                        {form.description.length}/100
                    </small>
                </div>
                <input
                    type="number"
                    placeholder="Precio anterior (opcional)"
                    value={form.oldPrice}
                    onChange={(e) =>
                        setForm({ ...form, oldPrice: e.target.value })
                    }
                />
                <input
                    placeholder="Precio"
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    required
                />
                <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    required
                >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(c => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setForm({ ...form, image: e.target.files[0] })}
                />
                <input
                    placeholder="Stock"
                    type="number"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    required
                />
                <div className="admin-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? "Guardando..." : (editingProduct ? "Actualizar producto" : "Crear producto")}
                    </button>
                    {editingProduct && (
                        <button type="button" onClick={cancelEdit} className="cancel-btn" disabled={loading}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}
