import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const cats = await Category.find({
      store: req.user.storeId
    }).sort({ name: 1 });

    res.json(cats);
  } catch (err) {
    res.status(500).json({
      error: "Error obteniendo categorías",
      details: err.message
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ error: "Nombre requerido" });

    const exists = await Category.findOne({
      name,
      store: req.user.storeId
    });

    if (exists)
      return res.status(400).json({ error: "Ya existe" });

    const cat = await Category.create({
      name,
      store: req.user.storeId
    });

    res.json(cat);

  } catch (err) {
    res.status(500).json({
      error: "Error creando categoría",
      details: err.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {

    const deleted = await Category.findOneAndDelete({
      _id: req.params.id,
      store: req.user.storeId
    });

    if (!deleted)
      return res.status(404).json({ error: "Categoría no encontrada" });

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({
      error: "Error eliminando categoría",
      details: err.message
    });
  }
};
