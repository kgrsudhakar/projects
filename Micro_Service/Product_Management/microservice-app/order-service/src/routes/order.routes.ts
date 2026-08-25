import { Router } from "express";

import {
  addOrder,
  fetchOrders,
} from "../controllers/order.controller";

const router = Router();

router.get("/", fetchOrders);

router.post("/", addOrder);

export default router;