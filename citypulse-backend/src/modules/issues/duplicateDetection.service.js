import { Issue } from "./issue.model.js";
import { env } from "../../config/env.js";

/**
 * Domain Service Design (ADR-004): Issue should not know how to compare
 * itself to every other issue — that's this service's job, kept separate
 * so it can evolve (distance -> distance + semantic similarity) without
 * IssueService ever changing.
 */
export const duplicateDetectionService = {
  /**
   * Finds an existing, non-closed issue of the same category within
   * `radiusMeters` of the given point. Returns the first (nearest) match
   * or null. $near sorts by distance automatically.
   */
  async findPotentialDuplicate({ longitude, latitude, category }, radiusMeters = env.duplicateRadiusMeters) {
    const candidate = await Issue.findOne({
      category,
      isDeleted: false,
      status: { $nin: ["closed"] },
      duplicateOf: null, // only compare against "original" issues, not other duplicates
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: radiusMeters,
        },
      },
    });

    return candidate;
  },
};
