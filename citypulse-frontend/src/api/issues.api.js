import { apiClient } from "./axiosClient.js";

export const issuesApi = {
  async list(filters = {}) {
    const { data } = await apiClient.get("/issues", { params: filters });
    return { issues: data.data.issues, meta: data.meta };
  },

  async getOne(id) {
    const { data } = await apiClient.get(`/issues/${id}`);
    return data.data.issue;
  },

  async create(payload) {
    // Returns either { issue } (created) or { existingIssue } (duplicate found)
    const { data } = await apiClient.post("/issues", payload);
    return data.data;
  },

  async vote(id) {
    const { data } = await apiClient.post(`/issues/${id}/vote`);
    return data.data.issue;
  },

  async unvote(id) {
    const { data } = await apiClient.delete(`/issues/${id}/vote`);
    return data.data.issue;
  },

  async changeStatus(id, { status, note }) {
    const { data } = await apiClient.patch(`/issues/${id}/status`, { status, note });
    return data.data.issue;
  },

  async assign(id, { department, assignedOfficer }) {
    const { data } = await apiClient.patch(`/issues/${id}/assign`, {
      department,
      assignedOfficer,
    });
    return data.data.issue;
  },

  async remove(id) {
    await apiClient.delete(`/issues/${id}`);
  },
};
