import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 503) {
      if (
        error.response.data?.code === "AI_QUOTA_EXCEEDED" ||
        error.response.data?.code === "AI_SERVICE_DOWN"
      ) {
        window.dispatchEvent(
          new CustomEvent("ai-agent-down", { detail: error.response.data })
        );
      }
    }
    return Promise.reject(error);
  }
);
