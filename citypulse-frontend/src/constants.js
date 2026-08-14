// Mirrors src/modules/issues/issue.constants.js on the backend. Kept in
// sync manually for the MVP -- if this drifts, the backend is the source
// of truth (it validates and enforces these; the frontend only labels them).
export const ISSUE_CATEGORIES = [
  { value: "pothole", label: "Pothole" },
  { value: "streetlight", label: "Streetlight" },
  { value: "garbage", label: "Garbage" },
  { value: "water_supply", label: "Water Supply" },
  { value: "drainage", label: "Drainage" },
  { value: "illegal_construction", label: "Illegal Construction" },
  { value: "public_safety", label: "Public Safety" },
  { value: "other", label: "Other" },
];

export const ISSUE_STATUS_LIST = [
  "reported",
  "verified",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
  "reopened",
];

export const STATUS_LABELS = {
  reported: "Reported",
  verified: "Verified",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  reopened: "Reopened",
};

// Legal next steps per role, mirroring the backend's STATUS_TRANSITIONS
// table. Used only to decide which buttons to SHOW -- the backend is
// still the one that enforces it, this is purely a UX convenience so
// citizens/officers don't click a button that's guaranteed to fail.
export const STATUS_TRANSITIONS = {
  reported: { verified: ["admin", "officer"] },
  verified: { assigned: ["admin"] },
  assigned: { in_progress: ["officer", "admin"] },
  in_progress: { resolved: ["officer", "admin"] },
  resolved: { closed: ["citizen", "admin"], reopened: ["citizen", "admin"] },
  reopened: { assigned: ["admin"] },
};

export const ROLES = {
  CITIZEN: "citizen",
  OFFICER: "officer",
  ADMIN: "admin",
};
