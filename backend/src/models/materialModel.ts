import pool from '../config/db';
import { Material, MaterialDTO } from './interfaces';

export class MaterialModel {
  // Get all materials
  static async getAllMaterials(): Promise<Material[]> {
    try {
      const result = await pool.query('SELECT * FROM materials ORDER BY name');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get a material by ID
  static async getMaterialById(id: number): Promise<Material | null> {
    try {
      const result = await pool.query('SELECT * FROM materials WHERE id = $1', [id]);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Create a material
  static async createMaterial(materialData: MaterialDTO): Promise<Material> {
    try {
      const query = `
        INSERT INTO materials (name, description)
        VALUES ($1, $2)
        RETURNING *
      `;
      const values = [materialData.name, materialData.description || null];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update a material
  static async updateMaterial(id: number, materialData: MaterialDTO): Promise<Material | null> {
    try {
      const query = `
        UPDATE materials
        SET name = $1, description = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `;
      const values = [materialData.name, materialData.description || null, id];
      const result = await pool.query(query, values);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Delete a material
  static async deleteMaterial(id: number): Promise<boolean> {
    try {
      // Check if material is used in any swords
      const checkQuery = 'SELECT COUNT(*) FROM sword_materials WHERE material_id = $1';
      const checkResult = await pool.query(checkQuery, [id]);
      
      if (parseInt(checkResult.rows[0].count) > 0) {
        // Material is used in swords, cannot delete
        throw new Error('Cannot delete material that is used in existing swords');
      }
      
      // No swords using this material, safe to delete
      const result = await pool.query('DELETE FROM materials WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get materials for a sword
  static async getMaterialsForSword(swordId: number): Promise<Material[]> {
    try {
      const query = `
        SELECT m.*
        FROM materials m
        JOIN sword_materials sm ON m.id = sm.material_id
        WHERE sm.sword_id = $1
        ORDER BY m.name
      `;
      const result = await pool.query(query, [swordId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Count swords using a material
  static async countSwordsUsingMaterial(id: number): Promise<number> {
    try {
      const query = 'SELECT COUNT(*) FROM sword_materials WHERE material_id = $1';
      const result = await pool.query(query, [id]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw error;
    }
  }
}