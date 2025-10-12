import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import federation from "@originjs/vite-plugin-federation";


/**
 * 1. plugins: Array where you tell Vite which plugins to use when it:
 *    * Runs your dev server
 *    * Builds your production bundle
 * 2. build: Controls how Vite produces the production build.
 */

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /**
     * Integrates Tailwind CSS with Vite’s build pipeline.
     * Allows you to use Tailwind’s utility classes and auto-purge unused styles in production.
     */
    tailwindcss(),
    /**
     * This is Module Federation, 
     * used for Micro-Frontend Architecture — allowing multiple separate builds (apps) to share code at runtime.
     */
    federation({
      /**
       * The name of your current Vite app (the “host”).
       */
      name: "host_app",
      /**
       * Defines an external app (the “remote”) that exposes modules you can dynamically import.
       */
      remotes: {
        remote_app: "http://localhost:5001/assets/remoteEntry.js",
      },
      /**
       * Ensures both apps (host and remote) reuse the same React instance instead of
       * bundling multiple copies — avoiding “invalid hook call” errors.
       */
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    /**
     * Disables Vite’s automatic <link rel="modulepreload"> tags, which can interfere with dynamic federation imports.
     */
    modulePreload: false,
    /**
     * Tells Vite to use modern JavaScript output (ESNext) — useful when all browsers you target support modern syntax.
     */
    target: "esnext",
    /**
     * Disables code minification — typically for debugging or development.
     */
    minify: false,
    /**
     * Bundles all CSS into a single file instead of multiple chunks — simplifies microfrontend integration.
     */
    cssCodeSplit: false,
  },
})
