import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@brindicis/api-client": path.resolve(__dirname, "./packages/api-client/dist"),
    },
  },
  server: {
    port: 5176,
  },
});
