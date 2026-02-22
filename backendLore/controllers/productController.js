import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      store: req.user.storeId
    }).populate("category");

    res.json(products);
  } catch (err) {
    console.log("ERROR READ:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

import Category from "../models/Category.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, oldPrice, description, stock, category } = req.body;

    if (!category) {
      return res.status(400).json({ error: "La categoría es obligatoria" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "La imagen es obligatoria" });
    }

    // se valida que la categoría pertenece a la tienda
    const categoryExists = await Category.findOne({
      _id: category,
      store: req.user.storeId
    });

    if (!categoryExists) {
      return res.status(400).json({ error: "Categoría inválida" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const product = await Product.create({
      name,
      price,
      oldPrice,
      description,
      stock,
      category,
      image: result.secure_url,
      imageId: result.public_id,
      store: req.user.storeId
    });

    res.json(product);

  } catch (err) {
    console.log("ERROR CREATE:", err);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      store: req.user.storeId
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (product.imageId) {
      await cloudinary.uploader.destroy(product.imageId);
    }

    await Product.deleteOne({
      _id: req.params.id,
      store: req.user.storeId
    });

    res.json({ message: "Producto eliminado" });

  } catch (err) {
    console.log("ERROR DELETE:", err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      store: req.user.storeId
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const { name, price, oldPrice, description, stock, category } = req.body;

    // se valida categoría
    const categoryExists = await Category.findOne({
      _id: category,
      store: req.user.storeId
    });

    if (!categoryExists) {
      return res.status(400).json({ error: "Categoría inválida" });
    }

    if (req.file) {
      if (product.imageId) {
        await cloudinary.uploader.destroy(product.imageId);
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      product.image = result.secure_url;
      product.imageId = result.public_id;
    }

    product.name = name;
    product.oldPrice = oldPrice;
    product.price = price;
    product.description = description;
    product.stock = stock;
    product.category = category;

    await product.save();

    res.json(product);

  } catch (err) {
    console.log("ERROR UPDATE:", err);
    res.status(500).json({ error: "Error al actualizar" });
  }
};
