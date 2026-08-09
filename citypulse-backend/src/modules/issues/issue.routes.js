import { Router } from "express";
import { issueController } from "./issue.controller.js";
import { validate } from "../../shared/middlewares/validate.js";
import { validateCreateIssue, validateStatusChange } from "./issue.validation.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { authorize } from "../../shared/middlewares/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

const router = Router();

router.use(authenticate); // every issue route requires a logged-in user

router.post("/", validate(validateCreateIssue), asyncHandler(issueController.create));
router.get("/", asyncHandler(issueController.list));
router.get("/:id", asyncHandler(issueController.getOne));

router.post("/:id/vote", authorize(ROLES.CITIZEN), asyncHandler(issueController.vote));
router.delete("/:id/vote", authorize(ROLES.CITIZEN), asyncHandler(issueController.unvote));

router.patch(
  "/:id/status",
  validate(validateStatusChange),
  asyncHandler(issueController.changeStatus) // role check happens inside the service via STATUS_TRANSITIONS
);

router.patch("/:id/assign", authorize(ROLES.ADMIN), asyncHandler(issueController.assign));

router.delete("/:id", authorize(ROLES.ADMIN, ROLES.CITIZEN), asyncHandler(issueController.remove));

export default router;
