import { departmentService } from "./department.service.js";
import { sendSuccess } from "../../shared/utils/apiResponse.js";

export const departmentController = {
  async create(req, res) {
    const department = await departmentService.createDepartment(req.body);
    sendSuccess(res, { statusCode: 201, message: "Department created", data: { department } });
  },

  async list(req, res) {
    const departments = await departmentService.listDepartments();
    sendSuccess(res, { message: "Departments fetched", data: { departments } });
  },

  async suggest(req, res) {
    const department = await departmentService.suggestDepartmentForCategory(req.query.category);
    sendSuccess(res, { message: "Department suggested", data: { department } });
  },

  async autoAssign(req, res) {
    const issue = await departmentService.assignIssueToSuggestedDepartment(
      req.params.issueId,
      req.user.id
    );
    sendSuccess(res, { message: "Issue auto-assigned", data: { issue } });
  },
};
