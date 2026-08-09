import bcrypt from "bcrypt";
import { authRepository } from "./auth.repository.js";
import { signToken } from "../../shared/utils/jwt.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ROLES } from "../../shared/constants/roles.js";

const SALT_ROUNDS = 10;

export const authService = {
  async register({ name, email, password }) {
    const existing = await authRepository.findByEmail(email);
    if (existing) {
      throw AppError.conflict("An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Public registration always creates a citizen (Role Separation
    // principle — officers/admins are provisioned by an admin, not signed
    // up publicly).
    const user = await authRepository.create({
      name,
      email,
      passwordHash,
      role: ROLES.CITIZEN,
    });

    const token = signToken({ sub: user._id.toString(), role: user.role });
    return { user, token };
  },

  async login({ email, password }) {
    const user = await authRepository.findByEmail(email, { withPassword: true });
    if (!user) {
      throw AppError.unauthorized("Invalid email or password");
    }
    if (!user.isActive) {
      throw AppError.forbidden("This account has been deactivated");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw AppError.unauthorized("Invalid email or password");
    }

    const token = signToken({ sub: user._id.toString(), role: user.role });
    return { user, token };
  },

  async getProfile(userId) {
    const user = await authRepository.findById(userId);
    if (!user) throw AppError.notFound("User not found");
    return user;
  },
};
