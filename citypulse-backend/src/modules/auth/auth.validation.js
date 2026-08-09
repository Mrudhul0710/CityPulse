const EMAIL_RE = /^\S+@\S+\.\S+$/;

export function validateRegister(body) {
  const errors = [];
  const { name, email, password, role } = body || {};

  if (!name || String(name).trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (!email || !EMAIL_RE.test(email)) {
    errors.push("A valid email is required");
  }
  if (!password || String(password).length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  // Citizens self-register. Officer/Admin accounts are created by an Admin
  // via the department module, never through public registration.
  if (role && role !== "citizen") {
    errors.push("Only citizen accounts can self-register");
  }

  return {
    errors,
    value: {
      name: name?.trim(),
      email: email?.toLowerCase().trim(),
      password,
    },
  };
}

export function validateLogin(body) {
  const errors = [];
  const { email, password } = body || {};

  if (!email || !EMAIL_RE.test(email)) errors.push("A valid email is required");
  if (!password) errors.push("Password is required");

  return {
    errors,
    value: { email: email?.toLowerCase().trim(), password },
  };
}
