import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";

const router = Router();

// GET all categories
router.get("/", CategoryController.getAllCategories);

// GET category by ID
router.get("/:id", CategoryController.getCategoryById);

// CREATE a new category
router.post("/", CategoryController.createCategory);

// UPDATE a category
router.put("/:id", CategoryController.updateCategory);

// DELETE a category
router.delete("/:id", CategoryController.deleteCategory);

export default router;
