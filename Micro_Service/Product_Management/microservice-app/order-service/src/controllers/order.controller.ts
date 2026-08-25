import { Request, Response } from "express";

import {
  createOrder,
  getOrders,
} from "../services/order.service";

export const addOrder = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      productId,
      quantity,
    } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "productId and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero",
      });
    }

    const order = await createOrder(
      Number(productId),
      Number(quantity)
    );

    res.status(201).json({
      success: true,
      data: order,
    });

  } catch (error: any) {

    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

export const fetchOrders = async (
  req: Request,
  res: Response
) => {
  try {

    const orders = await getOrders();

    res.json({
      success: true,
      data: orders,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};