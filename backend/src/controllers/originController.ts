import { Request, Response } from "express";
import { OriginModel } from "../models/originModel";
import { AdminModel } from "../models/adminModel";
import { OriginDTO } from "../models/interfaces";

export class OriginController {
  // Get all origins
  static async getAllOrigins(req: Request, res: Response): Promise<void> {
    try {
      const origins = await OriginModel.getAllOrigins();
      res.status(200).json(origins);
    } catch (error) {
      console.error("Error getting origins:", error);
      res.status(500).json({ error: "Failed to retrieve origins" });
    }
  }

  // Get an origin by ID
  static async getOriginById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid origin ID" });
        return;
      }

      const origin = await OriginModel.getOriginById(id);

      if (!origin) {
        res.status(404).json({ error: "Origin not found" });
        return;
      }

      // Get count of swords from this origin
      const swordCount = await OriginModel.countSwordsFromOrigin(id);

      res.status(200).json({
        ...origin,
        swordCount,
      });
    } catch (error) {
      console.error("Error getting origin:", error);
      res.status(500).json({ error: "Failed to retrieve origin" });
    }
  }

  // Create a new origin
  static async createOrigin(req: Request, res: Response): Promise<void> {
    try {
      const originData: OriginDTO = req.body;

      // Validate required fields
      if (!originData.name) {
        res.status(400).json({ error: "Name is required" });
        return;
      }

      // Admin password check (extra credit feature)
      if (req.body.adminPassword) {
        const isAdmin = await AdminModel.verifyPassword(req.body.adminPassword);
        if (!isAdmin) {
          res.status(403).json({ error: "Invalid admin password" });
          return;
        }
        // Remove the admin password from the data to create
        delete req.body.adminPassword;
      } else {
        res.status(403).json({ error: "Admin password required" });
        return;
      }

      const newOrigin = await OriginModel.createOrigin(originData);
      res.status(201).json(newOrigin);
    } catch (error) {
      console.error("Error creating origin:", error);
      res.status(500).json({ error: "Failed to create origin" });
    }
  }

  // Update an origin
  static async updateOrigin(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const originData: OriginDTO = req.body;

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid origin ID" });
        return;
      }

      // Validate required fields
      if (!originData.name) {
        res.status(400).json({ error: "Name is required" });
        return;
      }

      // Admin password check (extra credit feature)
      if (req.body.adminPassword) {
        const isAdmin = await AdminModel.verifyPassword(req.body.adminPassword);
        if (!isAdmin) {
          res.status(403).json({ error: "Invalid admin password" });
          return;
        }
        // Remove the admin password from the data to update
        delete req.body.adminPassword;
      } else {
        res.status(403).json({ error: "Admin password required" });
        return;
      }

      const updatedOrigin = await OriginModel.updateOrigin(id, originData);

      if (!updatedOrigin) {
        res.status(404).json({ error: "Origin not found" });
        return;
      }

      res.status(200).json(updatedOrigin);
    } catch (error) {
      console.error("Error updating origin:", error);
      res.status(500).json({ error: "Failed to update origin" });
    }
  }

  // Delete an origin
  static async deleteOrigin(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid origin ID" });
        return;
      }

      // Admin password check (extra credit feature)
      if (req.body.adminPassword) {
        const isAdmin = await AdminModel.verifyPassword(req.body.adminPassword);
        if (!isAdmin) {
          res.status(403).json({ error: "Invalid admin password" });
          return;
        }
      } else {
        res.status(403).json({ error: "Admin password required" });
        return;
      }

      const deleted = await OriginModel.deleteOrigin(id);

      if (!deleted) {
        res.status(404).json({ error: "Origin not found" });
        return;
      }

      res
        .status(200)
        .json({
          message:
            "Origin deleted successfully. Any swords from this origin have had their origin set to null.",
        });
    } catch (error) {
      console.error("Error deleting origin:", error);
      res.status(500).json({ error: "Failed to delete origin" });
    }
  }
}
