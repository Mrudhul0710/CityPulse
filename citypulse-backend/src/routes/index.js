import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import issueRoutes from "../modules/issues/issue.routes.js";
import departmentRoutes from "../modules/departments/department.routes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

router.use("/auth", authRoutes);
router.use("/issues", issueRoutes);
router.use("/departments", departmentRoutes);

export default router;
