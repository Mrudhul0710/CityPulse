import { User } from "./user.model.js";

/**
 * Repository layer: persistence only. No password hashing, no token
 * issuing, no business rules — that all lives in auth.service.js.
 */
export const authRepository = {
  async findByEmail(email, { withPassword = false } = {}) {
    const query = User.findOne({ email, isDeleted: false });
    if (withPassword) query.select("+passwordHash");
    return query.exec();
  },

  async findById(id) {
    return User.findOne({ _id: id, isDeleted: false });
  },

  async create({ name, email, passwordHash, role, department }) {
    return User.create({ name, email, passwordHash, role, department });
  },
};
