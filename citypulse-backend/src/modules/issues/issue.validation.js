import { ISSUE_CATEGORIES } from "./issue.constants.js";

export function validateCreateIssue(body) {
  const errors = [];
  const { title, description, category, latitude, longitude, address, ward } = body || {};

  if (!title || String(title).trim().length < 5) {
    errors.push("Title must be at least 5 characters");
  }
  if (!description || String(description).trim().length < 10) {
    errors.push("Description must be at least 10 characters");
  }
  if (!category || !ISSUE_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${ISSUE_CATEGORIES.join(", ")}`);
  }
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    errors.push("A valid latitude is required");
  }
  if (Number.isNaN(lng) || lng < -180 || lng > 180) {
    errors.push("A valid longitude is required");
  }

  return {
    errors,
    value: {
      title: title?.trim(),
      description: description?.trim(),
      category,
      latitude: lat,
      longitude: lng,
      address: address?.trim() || null,
      ward: ward?.trim() || null,
    },
  };
}

export function validateStatusChange(body) {
  const errors = [];
  const { status, note } = body || {};
  if (!status) errors.push("Target status is required");
  return { errors, value: { status, note: note?.trim() || null } };
}
