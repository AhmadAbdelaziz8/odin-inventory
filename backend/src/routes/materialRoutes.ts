import { Router } from "express";
import { MaterialController } from "../controllers/materialController";

const router = Router();

// GET all materials
router.get("/", MaterialController.getAllMaterials);

// GET material by ID
router.get("/:id", MaterialController.getMaterialById);

// CREATE a new material
router.post("/", MaterialController.createMaterial);

// UPDATE a material
router.put("/:id", MaterialController.updateMaterial);

// DELETE a material
router.delete("/:id", MaterialController.deleteMaterial);

export default router;
