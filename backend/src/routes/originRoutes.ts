import { Router } from "express";
import { OriginController } from "../controllers/originController";

const router = Router();

// GET all origins
router.get("/", OriginController.getAllOrigins);

// GET origin by ID
router.get("/:id", OriginController.getOriginById);

// CREATE a new origin
router.post("/", OriginController.createOrigin);

// UPDATE an origin
router.put("/:id", OriginController.updateOrigin);

// DELETE an origin
router.delete("/:id", OriginController.deleteOrigin);

export default router;
