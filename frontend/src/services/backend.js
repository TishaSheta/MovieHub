import axios from "axios";

// Axios instance for the Spring Boot API (TMDB still uses services/api.js)
const backend = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Attach the JWT to every request
backend.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token expired, clear the session and send the user to log in
backend.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCall = err.config?.url?.startsWith("/auth");
    if (err.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default backend;
