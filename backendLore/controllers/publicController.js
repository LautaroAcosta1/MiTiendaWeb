import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const getPublicStore = async (req, res) => {
  try {
    const { slug } = req.params;

    const store = await Store.findOne({ slug });
    if (!store) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }

    const categories = await Category.find({
      store: store._id
    }).sort({ name: 1 });

    const products = await Product.find({
      store: store._id
    }).populate("category");

    res.json({
      store: {
        name: store.name,
        slug: store.slug
      },
      categories,
      products
    });

  } catch (err) {
    res.status(500).json({
      error: "Error obteniendo tienda",
      details: err.message
    });
  }
};