import { apiClient } from "./axiosClient.js";

export const authApi = {
  async register({ name, email, password }) {
    const { data } = await apiClient.post("/auth/register", { name, email, password });
    return data.data; // { user, token }
  },

  async login({ email, password }) {
    const { data } = await apiClient.post("/auth/login", { email, password });
    return data.data; // { user, token }
  },

  async me() {
    const { data } = await apiClient.get("/auth/me");
    return data.data.user;
  },
};
