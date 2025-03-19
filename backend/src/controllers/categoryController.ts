import { Request, Response } from "express";
import { CategoryModel } from "../models/categoryModel";
import { AdminModel } from "../models/adminModel";
import { CategoryDTO } from "../models/interfaces";

export class CategoryController {
  // Get all categories
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryModel.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({ error: "Failed to retrieve categories" });
    }
  }

  // Get a category by ID
  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid category ID" });
        return;
      }

      const category = await CategoryModel.getCategoryById(id);

      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      // Get count of swords in this category
      const swordCount = await CategoryModel.countSwordsInCategory(id);

      res.status(200).json({
        ...category,
        swordCount,
      });
    } catch (error) {
      console.error("Error getting category:", error);
      res.status(500).json({ error: "Failed to retrieve category" });
    }
  }

  // Create a new category
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData: CategoryDTO = req.body;

      // Validate required fields
      if (!categoryData.name) {
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

      const newCategory = await CategoryModel.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  }

  // Update a category
  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const categoryData: CategoryDTO = req.body;

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid category ID" });
        return;
      }

      // Validate required fields
      if (!categoryData.name) {
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

      const updatedCategory = await CategoryModel.updateCategory(
        id,
        categoryData
      );

      if (!updatedCategory) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      res.status(200).json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  }

  // Delete a category
  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid category ID" });
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

      try {
        const deleted = await CategoryModel.deleteCategory(id);
        res.status(200).json({ message: "Category deleted successfully" });
      } catch (error: any) {
        if (
          error.message.includes("Cannot delete category with existing swords")
        ) {
          res.status(400).json({ error: error.message });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  }
}
