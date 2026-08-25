import { Request, Response } from "express";

import {
  getProducts,
  getProductById,
  createProduct,
} from "../services/product.service";

import { pool } from "../db/database";

export const fetchProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await getProducts();

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const fetchProductById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

export const addProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      price,
      stock,
      description,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

     if (stock === undefined) {

      return res.status(400).json({
        success: false,
        message: "Stock is required",
      });

    }

    const product = await createProduct(
      name,
      Number(price),
      stock,
      description || ""
    );

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};


export const deleteProduct = async (
  req: Request,
  res: Response
) => {
  try {

    const { id } = req.params;

    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }


    // Check product exists

    const existingProduct =
      await pool.query(
        `
        SELECT *
        FROM products
        WHERE id = $1
        `,
        [productId]
      );


    if (
      existingProduct.rows.length === 0
    ) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    }


    // Delete product

    await pool.query(
      `
      DELETE FROM products
      WHERE id = $1
      `,
      [productId]
    );


    return res.status(200).json({

      success: true,

      message:
        "Product deleted successfully",

      data: {
        id: productId,
      },

    });

  } catch (error) {

    console.error(
      "Delete product error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete product",

    });

  }
};