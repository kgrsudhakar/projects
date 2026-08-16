import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/user.validator.js";

const router = Router();

router.get("/", userController.list);
router.get("/:id", userController.getById);
router.post("/register", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);

export default router;
