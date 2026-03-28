import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://localhost:3443/api/v1",
  withCredentials: true,
  timeout: 15000,
});

/**
 * `httpsAgent` chỉ có trên Node (vd. SSR). Bundle client của Vite bỏ hẳn khối này (không kéo `node:https`).
 * Trên trình duyệt không thể bỏ qua self-signed bằng axios; dùng proxy Vite (`VITE_API_URL=/api/v1`) hoặc tin cậy cert.
 */
if (import.meta.env.SSR) {
  import("node:https").then(({ default: https }) => {
    api.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
  });
}

api.interceptors.request.use((config) => {
  const method = (config.method || "GET").toUpperCase();
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      /* ignore */
    }
  }
  if (import.meta.env.DEV) {
    console.log("API Request:", method, config.baseURL, config.url);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;

    if (!error?.response) {
      error.userMessage = "Không kết nối được máy chủ. Kiểm tra Backend hoặc chứng chỉ HTTPS.";
    }

    if (status === 401) {
      error.isUnauthorized = true;
      try {
        localStorage.removeItem("access_token");
      } catch {
        /* ignore */
      }
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (import.meta.env.DEV) {
      console.error("API Error:", {
        message: error?.message,
        status: status || "NO_RESPONSE",
        url: error?.config?.url || "unknown",
      });
    }

    return Promise.reject(error);
  },
);
