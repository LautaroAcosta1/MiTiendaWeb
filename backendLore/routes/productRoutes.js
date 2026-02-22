import express from "express";
import { getProducts, createProduct, deleteProduct, updateProduct } from "../controllers/productController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", auth, getProducts);
router.post("/", auth, upload.single("image"), createProduct);
router.delete("/:id", auth, deleteProduct);
router.put("/:id", auth, upload.single("image"), updateProduct);


export default router;
