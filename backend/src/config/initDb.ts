import fs from "fs";
import path from "path";
import pool from "./db";

const initDb = async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");
    await pool.query(sql);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

initDb();
