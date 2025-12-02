import viteTsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
  ],
  test: {
    coverage: {
      exclude: ["./src/{routeTree.gen.ts,test}"],
      include: ["./src/**/*.{ts,tsx}"],
      reportsDirectory: "./src/test/coverage",
    },
    dir: "./src",
    environment: "jsdom",
    globals: true,
    sequence: {
      shuffle: true,
    },
    setupFiles: "./src/test/setup.ts",
  },
});
