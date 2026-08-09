import mongoose from "mongoose";
import { ISSUE_CATEGORIES } from "../issues/issue.constants.js";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: null },

    // Category -> Department mapping that powers the Hybrid Assignment
    // model's "auto-suggest" step (ADR-003).
    categories: {
      type: [String],
      enum: ISSUE_CATEGORIES,
      default: [],
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Department = mongoose.model("Department", departmentSchema);
