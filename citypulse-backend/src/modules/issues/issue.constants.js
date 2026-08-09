// Category -> Department name mapping for the Hybrid Assignment model
// (ADR-003): auto-suggest a department from category, admin can override.
export const ISSUE_CATEGORIES = Object.freeze([
  "pothole",
  "streetlight",
  "garbage",
  "water_supply",
  "drainage",
  "illegal_construction",
  "public_safety",
  "other",
]);

// Final Issue Lifecycle, locked in the PRD.
export const ISSUE_STATUS = Object.freeze({
  REPORTED: "reported",
  VERIFIED: "verified",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
  REOPENED: "reopened",
});

export const ISSUE_STATUS_LIST = Object.values(ISSUE_STATUS);

// Which status transitions are legal, and who is allowed to make them.
// This table IS the workflow — the service layer consults it instead of
// hardcoding if/else chains, so the lifecycle stays visible in one place.
export const STATUS_TRANSITIONS = {
  [ISSUE_STATUS.REPORTED]: {
    [ISSUE_STATUS.VERIFIED]: ["admin", "officer"],
  },
  [ISSUE_STATUS.VERIFIED]: {
    [ISSUE_STATUS.ASSIGNED]: ["admin"],
  },
  [ISSUE_STATUS.ASSIGNED]: {
    [ISSUE_STATUS.IN_PROGRESS]: ["officer", "admin"],
  },
  [ISSUE_STATUS.IN_PROGRESS]: {
    [ISSUE_STATUS.RESOLVED]: ["officer", "admin"],
  },
  [ISSUE_STATUS.RESOLVED]: {
    [ISSUE_STATUS.CLOSED]: ["citizen", "admin"], // citizen confirms
    [ISSUE_STATUS.REOPENED]: ["citizen", "admin"], // citizen disputes resolution
  },
  [ISSUE_STATUS.REOPENED]: {
    [ISSUE_STATUS.ASSIGNED]: ["admin"],
  },
};
