import { Router } from "express";
import { SwordController } from "../controllers/swordController";

const router = Router();

// GET all swords
router.get("/", SwordController.getAllSwords);

// GET sword by ID
router.get("/:id", SwordController.getSwordById);

// GET swords by category
router.get("/category/:categoryId", SwordController.getSwordsByCategory);

// GET swords by material
router.get("/material/:materialId", SwordController.getSwordsByMaterial);

// Search swords
router.get("/search", SwordController.searchSwords);

// CREATE a new sword
router.post("/", SwordController.createSword);

// UPDATE a sword
router.put("/:id", SwordController.updateSword);

// DELETE a sword
router.delete("/:id", SwordController.deleteSword);

export default router;
