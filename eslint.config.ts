// @ts-expect-error -- FIXME: Could not find a declaration file
// eslint-disable-next-line
import sortDestructureKeysPlugin from "eslint-plugin-sort-destructure-keys";

import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import { type ESLint, type Linter } from "eslint";
import importPlugin from "eslint-plugin-import";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import globals from "globals";
import { rules } from "./eslint.rules";

const config: Array<Linter.Config> = [
  { files: ["**/*.*{t,j}s*"] },
  {
    ignores: [
      ".build/**/*",
      "node_modules/**/*",
      "package-lock.json",
      "src/app/root/public/**/*",
      "src/test/coverage/**/*",
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 12,
      globals: { ...globals.browser },
      parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        warnOnUnsupportedTypeScriptVersion: false,
      },
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin as unknown as ESLint.Plugin,
      import: importPlugin,
      local: { rules: { rules } },
      perfectionist: perfectionistPlugin,
      prettier: prettierPlugin,
      react: reactPlugin,
      "sort-destructure-keys": sortDestructureKeysPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: false,
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrors: "none",
          varsIgnorePattern: "^_",
        },
      ],
      eqeqeq: "error",
      "import/order": [
        "error",
        {
          alphabetize: { caseInsensitive: true, order: "asc" },
          groups: [
            "builtin",
            "external",
            "internal",
            "index",
            "parent",
            "sibling",
          ],
          "newlines-between": "never",
          pathGroups: [
            { group: "internal", pattern: "@/**", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
      "local/rules": "error",
      "no-import-assign": "error",
      "no-unreachable": "error",
      "perfectionist/sort-array-includes": "error",
      "perfectionist/sort-classes": "error",
      "perfectionist/sort-interfaces": "error",
      "perfectionist/sort-jsx-props": "error",
      "perfectionist/sort-maps": "error",
      "perfectionist/sort-object-types": "error",
      "perfectionist/sort-objects": "error",
      "perfectionist/sort-switch-case": "error",
      "perfectionist/sort-union-types": "error",
      "prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
      "prefer-const": "error",
      "prettier/prettier": "error",
      "require-await": "error",
      "sort-destructure-keys/sort-destructure-keys": [
        "error",
        { caseSensitive: false },
      ],
      "sort-imports": [
        "error",
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        },
      ],
      "unused-imports/no-unused-imports": "error",
    },
    settings: { react: { version: "detect" } },
  },
  {
    files: ["**/*.test.ts*"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
];

export default config;
