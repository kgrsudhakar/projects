import { Router } from "express";

import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { authenticate, AuthRequest } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router=Router();

const controller=new AuthController();

router.post("/register", validate(registerSchema),  controller.register);

router.post("/login", validate(loginSchema), controller.login);

router.post(
  "/refresh-token",
  controller.refreshToken
);

router.post(
    "/logout",
    authenticate,
    controller.logout
);


router.get(
    "/profile",
    authenticate,
    (req: AuthRequest, res) => {

        res.json({
            success: true,
            user: req.user
        });

    }
);

router.get(
    "/admin/dashboard",
    authenticate,
    authorize("ADMIN"),
    (req, res) => {
        res.json({
            message: "Welcome Admin"
        });

    }
);
export default router;