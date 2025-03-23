import fs from "fs";
import path from "path";
import pool from "./db";

async function initializeDatabase() {
  try {
    // Drop existing tables if they exist
    const client = await pool.connect();
    await client.query(`
      DROP TABLE IF EXISTS sword_materials CASCADE;
      DROP TABLE IF EXISTS swords CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS materials CASCADE;
      DROP TABLE IF EXISTS origins CASCADE;
      DROP TABLE IF EXISTS admin_auth CASCADE;
    `);

    // Read SQL schema
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    // Execute the SQL
    await client.query(schemaSql);
    console.log("Database schema initialized successfully");

    // Insert some initial data
    await insertSampleData(client);

    client.release();
    console.log("Database initialized with sample data");
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
}

async function insertSampleData(client: any) {
  // Insert categories
  await client.query(`
    INSERT INTO categories (name, description) VALUES
    ('Katana', 'Traditional Japanese sword characterized by a curved, single-edged blade'),
    ('Longsword', 'European sword with a cruciform hilt and straight double-edged blade'),
    ('Rapier', 'Long, slender, sharply pointed sword designed for thrusting attacks'),
    ('Claymore', 'Scottish large two-handed sword'),
    ('Scimitar', 'Curved blade with the cutting edge on the convex side, originating from the Middle East')
    ON CONFLICT (name) DO NOTHING;
  `);

  // Insert materials
  await client.query(`
    INSERT INTO materials (name, description) VALUES
    ('Steel', 'Common iron alloy used in most modern sword replicas'),
    ('Damascus Steel', 'Historic steel known for distinctive patterns'),
    ('Carbon Steel', 'Steel with higher carbon content for better edge retention'),
    ('Folded Steel', 'Steel that has been folded multiple times during forging'),
    ('Bronze', 'Historic copper alloy used before the Iron Age'),
    ('Tamahagane', 'Traditional Japanese steel used in katana making')
    ON CONFLICT (name) DO NOTHING;
  `);

  // Insert origins
  await client.query(`
    INSERT INTO origins (name, region, historical_period) VALUES
    ('Japanese', 'Japan', 'Feudal Period'),
    ('European', 'Western Europe', 'Medieval Period'),
    ('Arabic', 'Middle East', 'Medieval Islamic Period'),
    ('Chinese', 'China', 'Ming Dynasty'),
    ('Celtic', 'Northern Europe', 'Iron Age')
    ON CONFLICT (name) DO NOTHING;
  `);

  // Insert sample swords
  const swordsResult = await client.query(`
    INSERT INTO swords 
    (name, category_id, origin_id, length, weight, is_battle_ready, in_stock, price, description) VALUES
    ('Bushido Katana', 
      (SELECT id FROM categories WHERE name = 'Katana'), 
      (SELECT id FROM origins WHERE name = 'Japanese'), 
      73.5, 1.2, true, 5, 899.99, 'Hand-forged traditional katana with real hamon'),
    ('Knight''s Longsword', 
      (SELECT id FROM categories WHERE name = 'Longsword'), 
      (SELECT id FROM origins WHERE name = 'European'), 
      110.0, 1.8, true, 3, 799.99, 'Historically accurate replica of a 14th century longsword'),
    ('Duelist Rapier', 
      (SELECT id FROM categories WHERE name = 'Rapier'), 
      (SELECT id FROM origins WHERE name = 'European'), 
      104.0, 1.0, false, 8, 499.99, 'Elegant rapier with ornate handguard, suitable for display')
    RETURNING id;
  `);

  // Get the inserted sword IDs
  const swordIds = swordsResult.rows.map((row: { id: number }) => row.id);

  // Insert sword-material relationships
  if (swordIds.length >= 3) {
    await client.query(
      `
      -- Katana with Tamahagane and Folded Steel
      INSERT INTO sword_materials (sword_id, material_id) VALUES
      ($1, (SELECT id FROM materials WHERE name = 'Tamahagane')),
      ($1, (SELECT id FROM materials WHERE name = 'Folded Steel')),
      
      -- Longsword with Carbon Steel
      ($2, (SELECT id FROM materials WHERE name = 'Carbon Steel')),
      
      -- Rapier with Steel
      ($3, (SELECT id FROM materials WHERE name = 'Steel'));
    `,
      [swordIds[0], swordIds[1], swordIds[2]]
    );
  }

  // Insert admin password (for example purposes, using 'admin123')
  // In a real app, use bcrypt or similar to hash passwords
  await client.query(`
    INSERT INTO admin_auth (password_hash) VALUES ('admin123');
  `);
}

// Execute the initialization
initializeDatabase();
