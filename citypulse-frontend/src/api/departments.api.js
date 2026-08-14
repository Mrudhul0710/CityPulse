import { apiClient } from "./axiosClient.js";

export const departmentsApi = {
  async list() {
    const { data } = await apiClient.get("/departments");
    return data.data.departments;
  },

  async autoAssign(issueId) {
    const { data } = await apiClient.patch(`/departments/auto-assign/${issueId}`);
    return data.data.issue;
  },
};
