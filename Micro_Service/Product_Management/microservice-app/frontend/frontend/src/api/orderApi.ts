import type {
  Order,
  CreateOrderRequest,
} from "../types/order";

const API_URL = "http://localhost:5000/api";


export const getOrders = async (): Promise<Order[]> => {

  const response = await fetch(
    `${API_URL}/orders`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const result = await response.json();

  return result.data;
};


export const createOrder = async (
  order: CreateOrderRequest
): Promise<Order> => {

  const response = await fetch(
    `${API_URL}/orders`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(order),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  const result = await response.json();

  return result.data;
};