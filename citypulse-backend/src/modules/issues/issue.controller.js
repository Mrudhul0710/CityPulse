import { issueService } from "./issue.service.js";
import { sendSuccess } from "../../shared/utils/apiResponse.js";

export const issueController = {
  async create(req, res) {
    const result = await issueService.createIssue(req.user.id, req.body);
    if (result.isDuplicate) {
      return sendSuccess(res, {
        statusCode: 200,
        message: result.message,
        data: { existingIssue: result.existingIssue },
      });
    }
    sendSuccess(res, {
      statusCode: 201,
      message: "Issue reported successfully",
      data: { issue: result.issue },
    });
  },

  async getOne(req, res) {
    const issue = await issueService.getIssue(req.params.id);
    sendSuccess(res, { message: "Issue fetched", data: { issue } });
  },

  async list(req, res) {
    const result = await issueService.listIssues(req.query);
    sendSuccess(res, {
      message: "Issues fetched",
      data: { issues: result.items },
      meta: { total: result.total, page: result.page, pages: result.pages },
    });
  },

  async vote(req, res) {
    const issue = await issueService.voteIssue(req.params.id, req.user.id);
    sendSuccess(res, { message: "Vote recorded", data: { issue } });
  },

  async unvote(req, res) {
    const issue = await issueService.removeVote(req.params.id, req.user.id);
    sendSuccess(res, { message: "Vote removed", data: { issue } });
  },

  async changeStatus(req, res) {
    const issue = await issueService.changeStatus(req.params.id, {
      targetStatus: req.body.status,
      note: req.body.note,
      actorId: req.user.id,
      actorRole: req.user.role,
    });
    sendSuccess(res, { message: "Status updated", data: { issue } });
  },

  async assign(req, res) {
    const issue = await issueService.assignDepartment(req.params.id, {
      department: req.body.department,
      assignedOfficer: req.body.assignedOfficer || null,
      actorId: req.user.id,
    });
    sendSuccess(res, { message: "Issue assigned", data: { issue } });
  },

  async remove(req, res) {
    await issueService.softDelete(req.params.id, req.user.id);
    sendSuccess(res, { message: "Issue deleted" });
  },
};
