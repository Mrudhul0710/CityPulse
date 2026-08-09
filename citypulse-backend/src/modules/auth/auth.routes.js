import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../shared/middlewares/validate.js";
import { validateRegister, validateLogin } from "./auth.validation.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

const router = Router();

// Routes only map URLs -> controller. No logic lives here.
router.post("/register", validate(validateRegister), asyncHandler(authController.register));
router.post("/login", validate(validateLogin), asyncHandler(authController.login));
router.get("/me", authenticate, asyncHandler(authController.me));

export default router;
