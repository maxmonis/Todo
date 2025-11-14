import tailwindcss from "@tailwindcss/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  cacheDir: "./node_modules",
  plugins: [
    tailwindcss(),
    viteReact(),
    viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
  ],
  test: {
    coverage: {
      exclude: ["./src/server/mongoose.ts"],
      reportsDirectory: "./src/test/coverage",
    },
    dir: "./src",
    environment: "jsdom",
    globals: true,
    isolate: true,
    setupFiles: "./src/test/setup.ts",
  },
})
