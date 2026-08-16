import { orderService } from "../services/order.service.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const orderController = {
  place: asyncHandler(async (req, res) => {
    const order = await orderService.placeOrder(req.body);
    res.status(201).json({ data: order });
  }),

  getById: asyncHandler(async (req, res) => {
    const order = await orderService.getOrder(req.params.id);
    res.json({ data: order });
  }),

  listForUser: asyncHandler(async (req, res) => {
    const orders = await orderService.listOrdersForUser(req.params.userId);
    res.json({ data: orders });
  }),

  listAll: asyncHandler(async (req, res) => {
    const orders = await orderService.listAllOrders();
    res.json({ data: orders });
  }),
};
