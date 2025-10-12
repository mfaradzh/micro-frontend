import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import federation from "@originjs/vite-plugin-federation";

/**
 * 1. plugins: Array where you tell Vite which plugins to use when it:
 *    * Runs your dev server
 *    * Builds your production bundle
 * 2. build: Controls how Vite produces the production build.
 * 3. preview: Controls how the application is served / previewed:
 *    * Useful in microfrontend setups where a fixed port and CORS enabled are needed so other apps can fetch your remote modules.
 *    * strictPort: true ensures predictable networking – avoids “it works on my machine” issues with random ports.
 */


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      /**
       * Defines this app’s federation name.
       */
      name: "remote_app",
      /**
       * The entry file generated when building this app.
       * It acts as the manifest that other apps (hosts) load to discover what modules you’ve exposed.
       */
      filename: "remoteEntry.js",
      /**
       * Declares which local files/components will be shared with other apps.
       */
      exposes: {
        "./Button": "./src/components/Button",
        "./Header": "./src/components/Header",
      },
      shared: ["react", "react-dom"],
    })],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  preview: {
    /**
     * Runs the preview server on port 5001 (must match host config).
     */
    port: 5001,
    /**
     * Prevents fallback to another port if 5001 is busy — consistent endpoint for host.
     */
    strictPort: true,
    /**
     * Enables CORS, allowing the host (on another port, e.g., 5173) to request modules from this remote app.
     */
    cors: true,
  },
})
