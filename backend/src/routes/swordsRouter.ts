import { Router } from "express";
import * as SwordController from "../controllers/swordsController";

const router = Router();

// Create
router.post("/", SwordController.createSword);

// Read
router.get("/", SwordController.getAllSwords);
router.get("/:id", SwordController.getSwordById);

// Update
router.put("/:id", SwordController.updateSword);

// Delete
router.delete("/:id", SwordController.deleteSword);

export default router;
