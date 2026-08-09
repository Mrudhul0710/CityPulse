import mongoose from "mongoose";
import { ROLES, ALL_ROLES } from "../../shared/constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never return by default
    },
    role: {
      type: String,
      enum: ALL_ROLES,
      default: ROLES.CITIZEN,
    },
    // Only meaningful when role === "officer" (ADR: Officers belong to one
    // department in the MVP — see PRD assumptions).
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    phone: { type: String, trim: true, default: null },

    isActive: { type: Boolean, default: true },

    // Soft delete (ADR-009)
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

// Never leak passwordHash even if a route forgets to .select("-passwordHash")
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
