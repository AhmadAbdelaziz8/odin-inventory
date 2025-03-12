// src/db.ts
import { Pool } from "pg";

const pool = new Pool({
  user: "ahmad",
  host: "localhost",
  database: "sword_inventory",
  password: "your_password",
  port: 5432,
});

export default pool;
