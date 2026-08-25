import type {
  Product,
  CreateProductRequest,
} from "../types/product";

const API_URL = "http://localhost:5000/api";

export const getProducts = async (): Promise<Product[]> => {

  const response = await fetch(
    `${API_URL}/products`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const result = await response.json();

  return result.data;
};


export const getProductById = async (
  id: number
): Promise<Product> => {

  const response = await fetch(
    `${API_URL}/products/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const result = await response.json();

  return result.data;
};


export const createProduct = async (
  product: CreateProductRequest
): Promise<Product> => {

  const response = await fetch(
    `${API_URL}/products`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(product),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  const result = await response.json();

  return result.data;
};