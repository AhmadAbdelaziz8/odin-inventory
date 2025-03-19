import pool from "../config/db";
import { Origin, OriginDTO } from "./interfaces";

export class OriginModel {
  // Get all origins
  static async getAllOrigins(): Promise<Origin[]> {
    try {
      const result = await pool.query("SELECT * FROM origins ORDER BY name");
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get an origin by ID
  static async getOriginById(id: number): Promise<Origin | null> {
    try {
      const result = await pool.query("SELECT * FROM origins WHERE id = $1", [
        id,
      ]);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Create an origin
  static async createOrigin(originData: OriginDTO): Promise<Origin> {
    try {
      const query = `
        INSERT INTO origins (name, region, historical_period, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const values = [
        originData.name,
        originData.region || null,
        originData.historical_period || null,
        originData.description || null,
      ];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update an origin
  static async updateOrigin(
    id: number,
    originData: OriginDTO
  ): Promise<Origin | null> {
    try {
      const query = `
        UPDATE origins
        SET name = $1, region = $2, historical_period = $3, description = $4, updated_at = NOW()
        WHERE id = $5
        RETURNING *
      `;
      const values = [
        originData.name,
        originData.region || null,
        originData.historical_period || null,
        originData.description || null,
        id,
      ];
      const result = await pool.query(query, values);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Delete an origin
  static async deleteOrigin(id: number): Promise<boolean> {
    try {
      // For origins, we will allow deletion and set foreign keys to null
      // This is already set up in our DB schema with ON DELETE SET NULL
      const result = await pool.query(
        "DELETE FROM origins WHERE id = $1 RETURNING id",
        [id]
      );
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Count swords from an origin
  static async countSwordsFromOrigin(id: number): Promise<number> {
    try {
      const query = "SELECT COUNT(*) FROM swords WHERE origin_id = $1";
      const result = await pool.query(query, [id]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw error;
    }
  }
}
