import { Request, Response } from "express";
import pool from "../db";

export const getAllSwords = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM swords");
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSwordById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM swords WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createSword = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      weight,
      blade_material,
      handle_material,
      price,
      category_id,
    } = req.body;
    const result = await pool.query(
      "INSERT INTO swords (name, description, weight, blade_material, handle_material, price, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        name,
        description,
        weight,
        blade_material,
        handle_material,
        price,
        category_id,
      ]
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSword = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, weight, blade_material, handle_material, price, category_id } = req.body;
      const result = await pool.query(
        'UPDATE swords SET name=$1, description=$2, weight=$3, blade_material=$4, handle_material=$5, price=$6, category_id=$7 WHERE id=$8 RETURNING *',
        [name, description, weight, blade_material, handle_material, price, category_id, id]
      );
      res.json(result.rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
export const deleteSword = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { adminPassword } = req.body;
      const result = await pool.query('DELETE FROM swords WHERE id = $1 RETURNING *', [id]);
      res.json(result.rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };