import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    console.log("ERROR READ:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, price, description, stock, category } = req.body;

    if (!category) {
      return res.status(400).json({ error: "La categoría es obligatoria" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "La imagen es obligatoria" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const product = await Product.create({
      name,
      price,
      description,
      stock,
      category,
      image: result.secure_url,
      imageId: result.public_id,
    });

    res.json(product);
  } catch (err) {
    console.log("ERROR CREATE:", err);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (product.imageId) {
      await cloudinary.uploader.destroy(product.imageId);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.log("ERROR DELETE:", err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const { name, price, description, stock, category } = req.body;

    if (!category) {
      return res.status(400).json({ error: "La categoría es obligatoria" });
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
