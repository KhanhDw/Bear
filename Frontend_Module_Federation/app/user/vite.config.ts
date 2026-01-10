import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "user",
      filename: "remoteEntry.js",
      exposes: {
        "./UserApp": "./src/bootstrap",
      },
      shared: ["react", "react-dom", "react-router-dom"],
    }),
  ],

  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: true,
  },

  server: {
    host: true,
    port: 5174,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },

  preview: {
    port: 5174,
  },
});
