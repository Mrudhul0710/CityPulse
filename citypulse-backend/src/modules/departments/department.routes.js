import { Router } from "express";
import { departmentController } from "./department.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { authorize } from "../../shared/middlewares/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

const router = Router();

router.use(authenticate);

router.post("/", authorize(ROLES.ADMIN), asyncHandler(departmentController.create));
router.get("/", asyncHandler(departmentController.list));
router.get("/suggest", authorize(ROLES.ADMIN), asyncHandler(departmentController.suggest));
router.patch(
  "/auto-assign/:issueId",
  authorize(ROLES.ADMIN),
  asyncHandler(departmentController.autoAssign)
);

export default router;
