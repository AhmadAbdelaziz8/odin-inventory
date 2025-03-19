-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS sword_materials;
DROP TABLE IF EXISTS swords;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS origins;

-- Create categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create materials table
CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create origins table
CREATE TABLE origins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  region VARCHAR(100),
  historical_period VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create swords table
CREATE TABLE swords (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
  origin_id INTEGER REFERENCES origins(id) ON DELETE SET NULL,
  length DECIMAL(6,2),
  weight DECIMAL(6,2),
  date_manufactured DATE,
  is_battle_ready BOOLEAN DEFAULT false,
  in_stock INTEGER DEFAULT 0,
  price DECIMAL(10,2),
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create junction table for sword-material relationship
CREATE TABLE sword_materials (
  sword_id INTEGER REFERENCES swords(id) ON DELETE CASCADE,
  material_id INTEGER REFERENCES materials(id) ON DELETE RESTRICT,
  PRIMARY KEY (sword_id, material_id)
);

-- Add admin password table for extra credit functionality
CREATE TABLE admin_auth (
  id SERIAL PRIMARY KEY,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);