import tailwindcss from "@tailwindcss/vite"
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import viteTsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    nitroV2Plugin(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
  ],
  server: { port: 3000 },
})
