import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo categorías", details: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nombre requerido" });

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ error: "Ya existe" });

    const cat = await Category.create({ name });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: "Error creando categoría", details: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando categoría", details: err.message });
  }
};
