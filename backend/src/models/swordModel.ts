import pool from '../config/db';
import { Sword, CreateSwordDTO, UpdateSwordDTO, SwordWithDetails, Material } from './interfaces';

export class SwordModel {
  // Get all swords with basic info
  static async getAllSwords(): Promise<Sword[]> {
    try {
      const result = await pool.query('SELECT * FROM swords ORDER BY name');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all swords with details (category, origin, materials)
  static async getAllSwordsWithDetails(): Promise<SwordWithDetails[]> {
    try {
      const query = `
        SELECT s.*, c.name as category_name, o.name as origin_name
        FROM swords s
        LEFT JOIN categories c ON s.category_id = c.id
        LEFT JOIN origins o ON s.origin_id = o.id
        ORDER BY s.name
      `;
      const result = await pool.query(query);
      const swords = result.rows;

      // Get materials for each sword
      for (const sword of swords) {
        const materialsQuery = `
          SELECT m.*
          FROM materials m
          JOIN sword_materials sm ON m.id = sm.material_id
          WHERE sm.sword_id = $1
        `;
        const materialsResult = await pool.query(materialsQuery, [sword.id]);
        sword.materials = materialsResult.rows;
      }

      return swords;
    } catch (error) {
      throw error;
    }
  }

  // Get a single sword by ID with all details
  static async getSwordById(id: number): Promise<SwordWithDetails | null> {
    try {
      const query = `
        SELECT s.*, c.name as category_name, o.name as origin_name
        FROM swords s
        LEFT JOIN categories c ON s.category_id = c.id
        LEFT JOIN origins o ON s.origin_id = o.id
        WHERE s.id = $1
      `;
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const sword = result.rows[0];

      // Get materials for the sword
      const materialsQuery = `
        SELECT m.*
        FROM materials m
        JOIN sword_materials sm ON m.id = sm.material_id
        WHERE sm.sword_id = $1
      `;
      const materialsResult = await pool.query(materialsQuery, [id]);
      sword.materials = materialsResult.rows;

      return sword;
    } catch (error) {
      throw error;
    }
  }

  // Create a new sword
  static async createSword(swordData: CreateSwordDTO): Promise<Sword> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { material_ids, ...swordFields } = swordData;
      
      // Insert the sword
      const swordQuery = `
        INSERT INTO swords (
          name, category_id, origin_id, length, weight, date_manufactured,
          is_battle_ready, in_stock, price, description, image_url
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        ) RETURNING *
      `;
      
      const swordValues = [
        swordFields.name,
        swordFields.category_id,
        swordFields.origin_id || null,
        swordFields.length || null,
        swordFields.weight || null,
        swordFields.date_manufactured || null,
        swordFields.is_battle_ready || false,
        swordFields.in_stock || 0,
        swordFields.price || null,
        swordFields.description || null,
        swordFields.image_url || null
      ];
      
      const swordResult = await client.query(swordQuery, swordValues);
      const newSword = swordResult.rows[0];
      
      // Add materials if provided
      if (material_ids && material_ids.length > 0) {
        const materialValues = material_ids.map(materialId => {
          return `(${newSword.id}, ${materialId})`;
        }).join(', ');
        
        await client.query(`
          INSERT INTO sword_materials (sword_id, material_id)
          VALUES ${materialValues}
        `);
      }
      
      await client.query('COMMIT');
      return newSword;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Update an existing sword
  static async updateSword(id: number, swordData: UpdateSwordDTO): Promise<Sword | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if sword exists
      const checkResult = await client.query('SELECT * FROM swords WHERE id = $1', [id]);
      if (checkResult.rows.length === 0) {
        return null;
      }
      
      const { material_ids, ...swordFields } = swordData;
      
      // Build update query dynamically based on provided fields
      let updateQuery = 'UPDATE swords SET updated_at = NOW()';
      const values: any[] = [];
      let paramCounter = 1;
      
      // Add each field that is present in the update data
      Object.entries(swordFields).forEach(([key, value]) => {
        if (value !== undefined) {
          updateQuery += `, ${key} = $${paramCounter}`;
          values.push(value);
          paramCounter++;
        }
      });
      
      // Finalize query
      updateQuery += ' WHERE id = $' + paramCounter + ' RETURNING *';
      values.push(id);
      
      // Execute update if there are fields to update
      const updateResult = await client.query(updateQuery, values);
      const updatedSword = updateResult.rows[0];
      
      // Update materials if provided
      if (material_ids !== undefined) {
        // Remove existing materials
        await client.query('DELETE FROM sword_materials WHERE sword_id = $1', [id]);
        
        // Add new materials
        if (material_ids.length > 0) {
          const materialValues = material_ids.map(materialId => {
            return `(${id}, ${materialId})`;
          }).join(', ');
          
          await client.query(`
            INSERT INTO sword_materials (sword_id, material_id)
            VALUES ${materialValues}
          `);
        }
      }
      
      await client.query('COMMIT');
      return updatedSword;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Delete a sword
  static async deleteSword(id: number): Promise<boolean> {
    try {
      const result = await pool.query('DELETE FROM swords WHERE id = $1 RETURNING *', [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Find swords by category
  static async findSwordsByCategory(categoryId: number): Promise<Sword[]> {
    try {
      const result = await pool.query('SELECT * FROM swords WHERE category_id = $1', [categoryId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Find swords by material
  static async findSwordsByMaterial(materialId: number): Promise<Sword[]> {
    try {
      const query = `
        SELECT s.*
        FROM swords s
        JOIN sword_materials sm ON s.id = sm.sword_id
        WHERE sm.material_id = $1
      `;
      const result = await pool.query(query, [materialId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Search swords by name
  static async searchSwords(searchTerm: string): Promise<Sword[]> {
    try {
      const query = `
        SELECT * FROM swords
        WHERE name ILIKE $1
        ORDER BY name
      `;
      const result = await pool.query(query, [`%${searchTerm}%`]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}