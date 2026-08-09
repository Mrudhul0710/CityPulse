import mongoose from "mongoose";
import { ISSUE_CATEGORIES, ISSUE_STATUS, ISSUE_STATUS_LIST } from "./issue.constants.js";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true }, // Cloudinary asset id, for deletion
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const voteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    votedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const statusHistoryEntrySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ISSUE_STATUS_LIST, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String, default: null },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// GeoJSON Point (ADR-008). MongoDB's 2dsphere index needs coordinates as
// [longitude, latitude] — note the order, it trips people up constantly.
const locationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
      validate: {
        validator: (arr) => arr.length === 2,
        message: "Coordinates must be [longitude, latitude]",
      },
    },
    address: { type: String, default: null },
    ward: { type: String, default: null },
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },

    category: { type: String, enum: ISSUE_CATEGORIES, required: true },

    location: { type: locationSchema, required: true },
    images: { type: [imageSchema], default: [] },

    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: {
      type: String,
      enum: ISSUE_STATUS_LIST,
      default: ISSUE_STATUS.REPORTED,
    },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },

    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    votes: { type: [voteSchema], default: [] },
    voteCount: { type: Number, default: 0 }, // denormalized for fast sorting

    history: { type: [statusHistoryEntrySchema], default: [] },

    // Single Source of Truth principle: if this issue is a duplicate of
    // another, it POINTS to the original instead of existing independently.
    duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", default: null },

    // Reserved for future AI (Sprint 5, Step 7) — untouched by MVP logic.
    aiMetadata: {
      categoryConfidence: { type: Number, default: null },
      duplicateScore: { type: Number, default: null },
      embeddingId: { type: String, default: null },
      summary: { type: String, default: null },
      tags: { type: [String], default: [] },
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

// Powers nearby search, duplicate detection, and heatmaps (ADR-008).
issueSchema.index({ location: "2dsphere" });
issueSchema.index({ status: 1 });
issueSchema.index({ category: 1 });
issueSchema.index({ department: 1 });
issueSchema.index({ createdAt: -1 });

export const Issue = mongoose.model("Issue", issueSchema);
