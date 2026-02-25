import User from "../models/User.js";
import Store from "../models/Store.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import slugify from "slugify";

export const register = async (req, res) => {
  try {
    const { name, email, password, storeName } = req.body;

    // 1️⃣ Verificar email único
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email ya registrado" });
    }

    // 2️⃣ Generar slug base
    let baseSlug = slugify(storeName, { lower: true, strict: true });

    let slug = baseSlug;
    let counter = 1;

    // 3️⃣ Asegurar slug único
    while (await Store.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // 4️⃣ Crear tienda
    const store = await Store.create({
      name: storeName,
      slug
    });

    // 5️⃣ Crear usuario vinculado
    const user = await User.create({
      name,
      email,
      password,
      store: store._id
    });

    // 6️⃣ Crear JWT
    const token = jwt.sign(
      { userId: user._id, storeId: store._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      store: {
        id: store._id,
        name: store.name,
        slug: store.slug
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ error: "Error en registro" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Buscamos el usuario y traemos su tienda
    const user = await User.findOne({ email }).populate("store");
    if (!user) {
      return res.status(404).json({ msg: "Usuario no existe" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ msg: "Password incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        storeId: user.store._id
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 🔹 Ahora devolvemos también la tienda
    res.json({
      token,
      store: {
        name: user.store.name,
        slug: user.store.slug
      }
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Error en login" });
  }
};