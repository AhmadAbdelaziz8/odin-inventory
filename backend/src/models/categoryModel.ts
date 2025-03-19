import pool from '../config/db';
import { Category, CategoryDTO } from './interfaces';

export class CategoryModel {
  // Get all categories
  static async getAllCategories(): Promise<Category[]> {
    try {
      const result = await pool.query('SELECT * FROM categories ORDER BY name');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get a category by ID
  static async getCategoryById(id: number): Promise<Category | null> {
    try {
      const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Create a category
  static async createCategory(categoryData: CategoryDTO): Promise<Category> {
    try {
      const query = `
        INSERT INTO categories (name, description)
        VALUES ($1, $2)
        RETURNING *
      `;
      const values = [categoryData.name, categoryData.description || null];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update a category
  static async updateCategory(id: number, categoryData: CategoryDTO): Promise<Category | null> {
    try {
      const query = `
        UPDATE categories
        SET name = $1, description = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `;
      const values = [categoryData.name, categoryData.description || null, id];
      const result = await pool.query(query, values);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Delete a category
  static async deleteCategory(id: number): Promise<boolean> {
    try {
      // Check if category has swords
      const checkQuery = 'SELECT COUNT(*) FROM swords WHERE category_id = $1';
      const checkResult = await pool.query(checkQuery, [id]);
      
      if (parseInt(checkResult.rows[0].count) > 0) {
        // Category has swords, cannot delete
        throw new Error('Cannot delete category with existing swords');
      }
      
      // No swords, safe to delete
      const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Count swords in a category
  static async countSwordsInCategory(id: number): Promise<number> {
    try {
      const query = 'SELECT COUNT(*) FROM swords WHERE category_id = $1';
      const result = await pool.query(query, [id]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw error;
    }
  }
}