import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/kaleidoscope-web/",
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@app", replacement: path.resolve(import.meta.dirname, "src") },
    ],
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,jsx}"],
  },
});
