import express from "express";
import { getPublicStore } from "../controllers/publicController.js";

const router = express.Router();

router.get("/:slug", getPublicStore);

export default router;