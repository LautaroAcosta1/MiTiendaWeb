import express from "express";
import { getCategories, createCategory, deleteCategory } from "../controllers/categoryController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getCategories);
router.post("/", auth, createCategory);
router.delete("/:id", auth, deleteCategory);

export default router;
