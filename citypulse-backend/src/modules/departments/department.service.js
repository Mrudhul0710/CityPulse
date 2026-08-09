import { departmentRepository } from "./department.repository.js";
import { issueRepository } from "../issues/issue.repository.js";
import { AppError } from "../../shared/errors/AppError.js";

export const departmentService = {
  async createDepartment(data) {
    return departmentRepository.create(data);
  },

  async listDepartments() {
    return departmentRepository.findAll();
  },

  /**
   * Hybrid Assignment, step 1 (ADR-003): suggest a department from the
   * issue's category. The admin then either accepts this suggestion or
   * overrides it via issueService.assignDepartment — this function never
   * writes anything itself, it only recommends.
   */
  async suggestDepartmentForCategory(category) {
    const department = await departmentRepository.findByCategory(category);
    if (!department) {
      throw AppError.notFound(`No department is configured to handle category '${category}'`);
    }
    return department;
  },

  async assignIssueToSuggestedDepartment(issueId, actorId) {
    const issue = await issueRepository.findById(issueId);
    if (!issue) throw AppError.notFound("Issue not found");

    const suggested = await this.suggestDepartmentForCategory(issue.category);

    return issueRepository.assignDepartment(issueId, {
      department: suggested._id,
      assignedOfficer: null,
    }).then(() =>
      issueRepository.updateStatus(issueId, {
        status: "assigned",
        changedBy: actorId,
        note: `Auto-assigned to ${suggested.name} based on category`,
      })
    );
  },
};
