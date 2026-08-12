import { Router } from "express";

import { ClaimController } from "../controllers/claim.controller.js";

import {
  authenticate,
} from "../middlewares/auth.middleware.js";

const router = Router();

const controller =
  new ClaimController();

router.post(
  "/",
  authenticate,
  controller.create
);

router.get(
  "/",
  authenticate,
  controller.getAll
);

router.get(
  "/:id",
  authenticate,
  controller.getById
);

router.put(
  "/:id",
  authenticate,
  controller.update
);

/**
 * Update Claim
 */
router.put(
  "/:id",
  authenticate,
  controller.update
);


/**
 * Update Claim Status
 *
 * IMPORTANT:
 * Keep this before DELETE /:id.
 */
router.patch(
  "/:id/status",
  authenticate,
  controller.updateStatus
);

router.delete(
  "/:id",
  authenticate,
  controller.delete
);

export default router;