import { pool } from "../db/database";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  created_at: Date;
}

export const getProducts = async (): Promise<Product[]> => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      price,
      stock,
      description,
      created_at
    FROM products
    ORDER BY id DESC
    `
  );

  return result.rows;
};

export const getProductById = async (
  id: number
): Promise<Product | null> => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      price,
      stock,
      description,
      created_at
    FROM products
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
};

export const createProduct = async (
  name: string,
  price: number,
  stock: number,
  description: string
): Promise<Product> => {
  const result = await pool.query(
    `
    INSERT INTO products
    (name, price, stock, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [name, price, stock, description]
  );

  return result.rows[0];
};