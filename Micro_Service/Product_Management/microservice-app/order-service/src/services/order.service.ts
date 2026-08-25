import axios from "axios";
import { pool } from "../db/database";

interface Product {
  id: number;
  name: string;
  price: number;
}

export const createOrder = async (
  productId: number,
  quantity: number
) => {

  // Call Product Microservice
  const response = await axios.get(
    `${process.env.PRODUCT_SERVICE_URL}/products/${productId}`
  );

  const product: Product = response.data.data;

  if (!product) {
    throw new Error("Product not found");
  }

  const totalAmount =
    Number(product.price) * quantity;

  const result = await pool.query(
    `
    INSERT INTO orders
    (product_id, quantity, total_amount)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [
      productId,
      quantity,
      totalAmount,
    ]
  );

  return {
    ...result.rows[0],
    product,
  };
};

export const getOrders = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM orders
    ORDER BY id DESC
    `
  );

  return result.rows;
};