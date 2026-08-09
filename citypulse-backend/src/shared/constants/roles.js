// Single source of truth for role strings. Never hardcode "admin"/"officer"
// as raw strings elsewhere — import from here so a typo becomes a lint/type
// error rather than a silent authorization bug.
export const ROLES = Object.freeze({
  CITIZEN: "citizen",
  OFFICER: "officer",
  ADMIN: "admin",
});

export const ALL_ROLES = Object.values(ROLES);
