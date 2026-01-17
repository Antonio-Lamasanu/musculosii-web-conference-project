import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:3001",
      "/users": "http://localhost:3001",
      "/papers": "http://localhost:3001",
      "/conferences": "http://localhost:3001",
    },
  },
});
