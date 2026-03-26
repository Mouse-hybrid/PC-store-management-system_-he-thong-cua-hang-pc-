import axios from "axios";

export const axiosInstance = axios.create({
  // Use relative baseURL so Vite proxy can forward to backend in dev.
  // (Do not use full https://localhost:3443 here to avoid proxy/CORS issues.)
  baseURL: "/api/v1",
  timeout: 15000,
});

