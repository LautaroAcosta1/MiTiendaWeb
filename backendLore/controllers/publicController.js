import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const getPublicStore = async (req, res) => {
  try {
    const { slug } = req.params;

    // busca tienda por slug
    const store = await Store.findOne({ slug }).select(
      "name slug logo theme"
    );

    if (!store) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }

    // busca categorías de esa tienda
    const categories = await Category.find({
      store: store._id
    }).select("name");

    // busca productos de esa tienda
    const products = await Product.find({
      store: store._id
    }).populate("category", "name");

    res.json({
      store,
      categories,
      products
    });

  } catch (err) {
    console.log("ERROR PUBLIC STORE:", err);
    res.status(500).json({ error: "Error al cargar la tienda" });
  }
};