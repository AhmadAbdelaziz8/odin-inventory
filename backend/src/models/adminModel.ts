import pool from "../config/db";

export class AdminModel {
  // Verify admin password
  static async verifyPassword(password: string): Promise<boolean> {
    try {
      // In a real application, you would hash the password and compare hashes
      // This is a simplified version for demonstration
      const result = await pool.query(
        "SELECT password_hash FROM admin_auth LIMIT 1"
      );

      if (result.rows.length === 0) {
        return false;
      }

      // Simple string comparison (not secure for production)
      return result.rows[0].password_hash === password;
    } catch (error) {
      throw error;
    }
  }
}
