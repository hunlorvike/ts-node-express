import { ESLint } from "eslint";
import globals from "globals";
import plugin from "@typescript-eslint/eslint-plugin";

const eslint = new ESLint({
  overrideConfig: {
    parser: "@typescript-eslint/parser",
    extends: [
      "plugin:@typescript-eslint/recommended",
      "standard-with-typescript"
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      ...plugin.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", args: "after-used", ignoreRestSiblings: false },
      ],
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
    },
    globals: {
      ...globals.browser,
    },
    overrides: [
      {
        files: ["*.ts"],
        parserOptions: {
          ecmaVersion: 2018,
          sourceType: "module",
        },
      },
    ],
  },
});

export default eslint;
