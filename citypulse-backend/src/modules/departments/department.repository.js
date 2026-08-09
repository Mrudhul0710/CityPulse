import { Department } from "./department.model.js";

export const departmentRepository = {
  async create(data) {
    return Department.create(data);
  },
  async findAll() {
    return Department.find({ isActive: true }).sort("name");
  },
  async findById(id) {
    return Department.findById(id);
  },
  async findByCategory(category) {
    // First matching active department that handles this category —
    // this is the "auto" half of Hybrid Assignment.
    return Department.findOne({ categories: category, isActive: true });
  },
};
