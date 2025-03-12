// src/dummyData.ts
import pool from "./db";

const createDummyData = async () => {
  try {
    // Create sample categories
    await pool.query(`
      INSERT INTO categories (name, description) VALUES
      ('Medieval', 'Swords from the medieval era'),
      ('Fantasy', 'Enchanted swords of legends')
    `);

    // Create sample swords
    await pool.query(`
      INSERT INTO swords (name, description, weight, blade_material, handle_material, price, category_id)
      VALUES
      ('Excalibur', 'The legendary sword of King Arthur', 3.5, 'Steel', 'Leather', 1000, 2),
      ('Longsword', 'A classic medieval longsword', 4.0, 'Damascus Steel', 'Wood', 750, 1)
    `);

    console.log("Dummy data inserted successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
};

createDummyData();
