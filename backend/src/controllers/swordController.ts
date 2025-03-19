import { Request, Response } from "express";
import { SwordModel } from "../models/swordModel";
import { AdminModel } from "../models/adminModel";
import { CreateSwordDTO, UpdateSwordDTO } from "../models/interfaces";

export class SwordController {
  // Get all swords
  static async getAllSwords(req: Request, res: Response): Promise<void> {
    try {
      const includeDetails = req.query.details === "true";

      const swords = includeDetails
        ? await SwordModel.getAllSwordsWithDetails()
        : await SwordModel.getAllSwords();

      res.status(200).json(swords);
    } catch (error) {
      console.error("Error getting swords:", error);
      res.status(500).json({ error: "Failed to retrieve swords" });
    }
  }

  // Get a sword by ID
  static async getSwordById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid sword ID" });
        return;
      }

      const sword = await SwordModel.getSwordById(id);

      if (!sword) {
        res.status(404).json({ error: "Sword not found" });
        return;
      }

      res.status(200).json(sword);
    } catch (error) {
      console.error("Error getting sword:", error);
      res.status(500).json({ error: "Failed to retrieve sword" });
    }
  }

  // Create a new sword
  static async createSword(req: Request, res: Response): Promise<void> {
    try {
      const swordData: CreateSwordDTO = req.body;

      // Validate required fields
      if (!swordData.name || !swordData.category_id) {
        res.status(400).json({ error: "Name and category are required" });
        return;
      }

      const newSword = await SwordModel.createSword(swordData);
      res.status(201).json(newSword);
    } catch (error) {
      console.error("Error creating sword:", error);
      res.status(500).json({ error: "Failed to create sword" });
    }
  }

  // Update a sword
  static async updateSword(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const swordData: UpdateSwordDTO = req.body;

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid sword ID" });
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

      const updatedSword = await SwordModel.updateSword(id, swordData);

      if (!updatedSword) {
        res.status(404).json({ error: "Sword not found" });
        return;
      }

      res.status(200).json(updatedSword);
    } catch (error) {
      console.error("Error updating sword:", error);
      res.status(500).json({ error: "Failed to update sword" });
    }
  }

  // Delete a sword
  static async deleteSword(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid sword ID" });
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

      const deleted = await SwordModel.deleteSword(id);

      if (!deleted) {
        res.status(404).json({ error: "Sword not found" });
        return;
      }

      res.status(200).json({ message: "Sword deleted successfully" });
    } catch (error) {
      console.error("Error deleting sword:", error);
      res.status(500).json({ error: "Failed to delete sword" });
    }
  }

  // Search for swords
  static async searchSwords(req: Request, res: Response): Promise<void> {
    try {
      const searchTerm = req.query.term as string;

      if (!searchTerm) {
        res.status(400).json({ error: "Search term is required" });
        return;
      }

      const swords = await SwordModel.searchSwords(searchTerm);
      res.status(200).json(swords);
    } catch (error) {
      console.error("Error searching swords:", error);
      res.status(500).json({ error: "Failed to search swords" });
    }
  }

  // Get swords by category
  static async getSwordsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);

      if (isNaN(categoryId)) {
        res.status(400).json({ error: "Invalid category ID" });
        return;
      }

      const swords = await SwordModel.findSwordsByCategory(categoryId);
      res.status(200).json(swords);
    } catch (error) {
      console.error("Error getting swords by category:", error);
      res.status(500).json({ error: "Failed to retrieve swords by category" });
    }
  }

  // Get swords by material
  static async getSwordsByMaterial(req: Request, res: Response): Promise<void> {
    try {
      const materialId = parseInt(req.params.materialId);

      if (isNaN(materialId)) {
        res.status(400).json({ error: "Invalid material ID" });
        return;
      }

      const swords = await SwordModel.findSwordsByMaterial(materialId);
      res.status(200).json(swords);
    } catch (error) {
      console.error("Error getting swords by material:", error);
      res.status(500).json({ error: "Failed to retrieve swords by material" });
    }
  }
}
