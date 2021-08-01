import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    cors: true,
    proxy: {
      "/api": {
        target: "https://memos.justsven.top/",
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "modules",
  },
});
