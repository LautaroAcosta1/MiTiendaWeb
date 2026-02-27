import express from "express";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import authMiddleware from "../middleware/auth.js"

const router = express.Router();

// obtener tienda pública por slug
router.get("/stores/:slug", async (req, res) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug });

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json(store);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// obtener productos por slug
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


// obtener categorías por slug
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

router.put("/store/settings", authMiddleware, async (req, res) => {
  try {
    const { name, whatsappNumber, whatsappMessage } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ msg: "El nombre de la tienda es obligatorio" });
    }

    const store = await Store.findByIdAndUpdate(
      req.user.storeId,
      {
        name: name.trim(),
        whatsappNumber,
        whatsappMessage,
      },
      { new: true }
    );

    res.json(store);

  } catch (err) {
    res.status(500).json({ msg: "Error actualizando configuración" });
  }
});

router.get("/store/settings", authMiddleware, async (req, res) => {
  try {
    const store = await Store.findById(req.user.storeId);
    res.json(store);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo configuración" });
  }
});

export default router;