import express from "express";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

const router = express.Router();


// 🔹 Obtener productos por slug
router.get("/stores/:slug/products", async (req, res) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const products = await Product.find({ store: store._id })
      .populate("category");

    res.json(products);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// 🔹 Obtener categorías por slug
router.get("/stores/:slug/categories", async (req, res) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const categories = await Category.find({ store: store._id });

    res.json(categories);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;