import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { validate } from "../middleware/validate.js";
import {
  createProductSchema,
  updateProductSchema,
  reserveStockSchema,
} from "../validators/product.validator.js";

/**
 * ROUTER MODULARIZATION PATTERN
 * ------------------------------
 * One router per resource/domain. This file is mounted once in app.js
 * (e.g. app.use("/api/products", productRouter)). As the service grows
 * you'd add order.routes.js, user.routes.js, etc. following the exact
 * same shape - easy to scan, easy to onboard new devs.
 */
const router = Router();

router.get("/", productController.list);
router.get("/:id", productController.getById);
router.post("/", validate(createProductSchema), productController.create);
router.patch("/:id", validate(updateProductSchema), productController.update);
router.delete("/:id", productController.remove);

// Internal endpoint - would be called by order-service in Day 2
router.post("/:id/reserve-stock", validate(reserveStockSchema), productController.reserveStock);

export default router;
