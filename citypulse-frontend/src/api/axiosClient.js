import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Attach the JWT to every request automatically, so individual API calls
// never have to remember to do it themselves.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("citypulse_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error shape: the backend's errorHandler always responds with
// { success: false, message, details }. Unwrap it here so every caller
// gets a plain Error with a useful .message instead of digging into
// err.response.data every time.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    const details = error.response?.data?.details;
    const normalized = new Error(message);
    normalized.details = details;
    normalized.status = error.response?.status;
    return Promise.reject(normalized);
  }
);
