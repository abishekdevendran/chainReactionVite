import { defineConfig } from "vite";
import { VitePWA as pwa } from "vite-plugin-pwa";
import manifest from "./manifest.json";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    pwa({
      strategies: "injectManifest",
      srcDir: "",
      filename: "service-worker.js",
      manifest,
    }),
  ],
  // server: {
  //   cors: false,
  //   proxy: {
  //     "/socketio": {
  //       target: "ws://localhost:5000",
  //       secure: false,
  //       changeOrigin: true,
  //       ws: true,
  //     },
  //   },
  // },
});
