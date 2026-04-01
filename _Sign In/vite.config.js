import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API dev: giúp tránh CORS/SSL (self-signed).
    proxy: {
      "/api": {
        target: "http://localhost:3443",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
