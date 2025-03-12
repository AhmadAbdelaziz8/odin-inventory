import { Router } from "express";
import * as categoriesController from "../controllers/categoriesController";
const router = Router();

// Create
router.post("/", categoriesController.createCategory);

// Read
router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategoryById);

export default router;
