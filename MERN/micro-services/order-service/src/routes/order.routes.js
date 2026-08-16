import { Router } from "express";
import { orderController } from "../controllers/order.controller.js";
import { validate } from "../middleware/validate.js";
import { placeOrderSchema } from "../validators/order.validator.js";

const router = Router();

router.get("/", orderController.listAll);
router.get("/:id", orderController.getById);
router.get("/user/:userId", orderController.listForUser);
router.post("/", validate(placeOrderSchema), orderController.place);

export default router;
