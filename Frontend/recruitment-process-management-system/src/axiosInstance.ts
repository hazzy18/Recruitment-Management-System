import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "", // Your backend API base URL
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to every request
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Optional: Handle Unauthorized Errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      // Optionally, clear the token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/auth/signin"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
