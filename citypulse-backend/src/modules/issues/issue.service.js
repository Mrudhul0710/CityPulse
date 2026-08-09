import { issueRepository } from "./issue.repository.js";
import { duplicateDetectionService } from "./duplicateDetection.service.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ISSUE_STATUS, STATUS_TRANSITIONS } from "./issue.constants.js";

export const issueService = {
  /**
   * Final Issue Lifecycle (PRD): Create -> Duplicate Detection ->
   * either "suggest upvote on existing" or "create new issue".
   */
  async createIssue(reporterId, input) {
    const { title, description, category, latitude, longitude, address, ward } = input;

    const duplicate = await duplicateDetectionService.findPotentialDuplicate({
      longitude,
      latitude,
      category,
    });

    if (duplicate) {
      // We don't silently merge — we tell the citizen a likely match
      // exists and let them upvote it instead of creating a fresh record
      // (Single Source of Truth principle).
      return {
        isDuplicate: true,
        existingIssue: duplicate,
        message: "A similar issue already exists nearby. Consider upvoting it instead.",
      };
    }

    const issue = await issueRepository.create({
      title,
      description,
      category,
      reporter: reporterId,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
        address,
        ward,
      },
      history: [{ status: ISSUE_STATUS.REPORTED, changedBy: reporterId, note: "Issue reported" }],
    });

    return { isDuplicate: false, issue };
  },

  async getIssue(issueId) {
    const issue = await issueRepository.findById(issueId);
    if (!issue) throw AppError.notFound("Issue not found");
    return issue;
  },

  async listIssues(query) {
    const { status, category, department, page, limit } = query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (department) filter.department = department;

    return issueRepository.list({
      filter,
      page: Number(page) || 1,
      limit: Math.min(Number(limit) || 20, 100),
    });
  },

  /** One vote per citizen (Functional Requirements). */
  async voteIssue(issueId, userId) {
    const updated = await issueRepository.addVote(issueId, userId);
    if (!updated) {
      // Either the issue doesn't exist, or the user already voted —
      // disambiguate for a clearer error message.
      const exists = await issueRepository.findById(issueId);
      if (!exists) throw AppError.notFound("Issue not found");
      throw AppError.conflict("You have already voted on this issue");
    }
    return updated;
  },

  async removeVote(issueId, userId) {
    const updated = await issueRepository.removeVote(issueId, userId);
    if (!updated) throw AppError.badRequest("You have not voted on this issue");
    return updated;
  },

  /**
   * Enforces the Final Issue Lifecycle as a state machine rather than
   * scattered if/else checks. Every transition is checked against
   * STATUS_TRANSITIONS for both legality and role permission.
   */
  async changeStatus(issueId, { targetStatus, actorId, actorRole, note }) {
    const issue = await issueRepository.findById(issueId);
    if (!issue) throw AppError.notFound("Issue not found");

    const allowedFromCurrent = STATUS_TRANSITIONS[issue.status] || {};
    const allowedRoles = allowedFromCurrent[targetStatus];

    if (!allowedRoles) {
      throw AppError.badRequest(
        `Cannot move issue from '${issue.status}' to '${targetStatus}'`
      );
    }
    if (!allowedRoles.includes(actorRole)) {
      throw AppError.forbidden(
        `Role '${actorRole}' cannot change status to '${targetStatus}'`
      );
    }

    return issueRepository.updateStatus(issueId, {
      status: targetStatus,
      changedBy: actorId,
      note,
    });
  },

  /**
   * Hybrid Department Assignment (ADR-003): auto-suggested by category
   * mapping (resolved by the caller/Department module), admin can override.
   * This method just performs the assignment once a department is decided.
   */
  async assignDepartment(issueId, { department, assignedOfficer, actorId }) {
    const updated = await issueRepository.assignDepartment(issueId, {
      department,
      assignedOfficer,
    });
    if (!updated) throw AppError.notFound("Issue not found");

    return issueRepository.updateStatus(issueId, {
      status: ISSUE_STATUS.ASSIGNED,
      changedBy: actorId,
      note: "Department/officer assigned",
    });
  },

  async softDelete(issueId, actorId) {
    const deleted = await issueRepository.softDelete(issueId, actorId);
    if (!deleted) throw AppError.notFound("Issue not found");
    return deleted;
  },
};
