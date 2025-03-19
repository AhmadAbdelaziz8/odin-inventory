import { Request, Response } from 'express';
import { MaterialModel } from '../models/materialModel';
import { AdminModel } from '../models/adminModel';
import { MaterialDTO } from '../models/interfaces';

export class MaterialController {
  // Get all materials
  static async getAllMaterials(req: Request, res: Response): Promise<void> {
    try {
      const materials = await MaterialModel.getAllMaterials();
      res.status(200).json(materials);
    } catch (error) {
      console.error('Error getting materials:', error);
      res.status(500).json({ error: 'Failed to retrieve materials' });
    }
  }

  // Get a material by ID
  static async getMaterialById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid material ID' });
        return;
      }
      
      const material = await MaterialModel.getMaterialById(id);
      
      if (!material) {
        res.status(404).json({ error: 'Material not found' });
        return;
      }
      
      // Get count of swords using this material
      const swordCount = await MaterialModel.countSwordsUsingMaterial(id);
      
      res.status(200).json({
        ...material,
        swordCount
      });
    } catch (error) {
      console.error('Error getting material:', error);
      res.status(500).json({ error: 'Failed to retrieve material' });
    }
  }

  // Create a new material
  static async createMaterial(req: Request, res: Response): Promise<void> {
    try {
      const materialData: MaterialDTO = req.body;
      
      // Validate required fields
      if (!materialData.name) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }
      
      // Admin password check (extra credit feature)
      if (req.body.adminPassword) {
        const isAdmin = await AdminModel.verifyPassword(req.body.adminPassword);
        if (!isAdmin) {
          res.status(403).json({ error: 'Invalid admin password' });
          return;
        }
        // Remove the admin password from the data to create
        delete req.body.adminPassword;
      } else {
        res.status(403).json({ error: 'Admin password required' });
        return;
      }
      
      const newMaterial = await MaterialModel.createMaterial(materialData);
      res.status(201).json(newMaterial);
    } catch (error) {
      console.error('Error creating material:', error);
      res.status(500).json({ error: 'Failed to create material' });
    }
  }

  // Update a material
  static async updateMaterial(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const materialData: MaterialDTO = req.body;
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid material ID' });
        return;
      }
      
      // Validate required fields
      if (!materialData.name) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }
      
      // Admin password check (extra credit feature)
      if (req.body.adminPassword) {
        const isAdmin = await AdminModel.verifyPassword(req.body.adminPassword);
        if (!isAdmin) {
          res.status(403).json({ error: 'Invalid admin password' });
          return;
        }
        // Remove the admin password from the data to update
        delete req.body.adminPassword;
      } else {
        res.status(403).json({ error: 'Admin password required' });
        return;
      }
      
      const updatedMaterial = await MaterialModel.updateMaterial(id, materialData);
      
      if (!updatedMaterial) {
        res.status(404).json({ error: 'Material not found' });
        return;
      }
      
      res.status(200).json(updatedMaterial);
    } catch (error) {
      console.error('Error updating material:', error);
      res.status(500).json({ error: 'Failed to update material' });
    }
  }

  // Delete a material
  static async deleteMaterial(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid material ID' });
        return;
      }
      
      // Admin password check (extra credit feature)
      if (req.body.adminPassword) {
        const isAdmin = await AdminModel.verifyPassword(req.body.adminPassword);
        if (!isAdmin) {
          res.status(403).json({ error: 'Invalid admin password' });
          return;
        }
      } else {
        res.status(403).json({ error: 'Admin password required' });
        return;
      }
      
      try {
        const deleted = await MaterialModel.deleteMaterial(id);
        res.status(200).json({ message: 'Material deleted successfully' });
      } catch (error: any) {
        if (error.message.includes('Cannot delete material')) {
          res.status(400).json({ error: error.message });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      res.status(500).json({ error: 'Failed to delete material' });
    }
  }
}