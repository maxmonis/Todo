import { tanstackConfig } from "@tanstack/eslint-config";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  ...tanstackConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
