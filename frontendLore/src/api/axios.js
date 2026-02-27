import axios from "axios";

const api = axios.create({
  baseURL: "https://mitiendaweb.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("storeSlug");

      // detectar slug actual
      const pathParts = window.location.pathname.split("/");
      const slug = pathParts[1];

      if (slug) {
        window.location.href = `/${slug}`;
      } else {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;