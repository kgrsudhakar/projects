import { Router } from "express";
import { PolicyController } from "../controllers/policy.controller.js";
import { asyncHandler } from "../../../middlewares/asyncHandler.js";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import { authorize } from "../../../middlewares/authorize.middleware.js";

const router = Router();
const controller = new PolicyController();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "AGENT"),
  asyncHandler(controller.create)
);

router.get(
  "/",
  authenticate,
  asyncHandler(controller.getAll)
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(controller.getById)
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(controller.update)
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(controller.delete)
);

export default router;