import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    // 开发时页面为 http://localhost:5173，经此代理访问 https://localhost:3443：
    // 浏览器只请求同源 /api/*，无混合内容问题；由 Node 代发 HTTPS（可忽略自签证书）。
    proxy: {
      "/api": {
        target: "https://localhost:3443",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "https://localhost:3443",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
