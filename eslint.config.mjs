import { ESLint } from "eslint";
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
      // Disable conflicting rules
      "no-unused-vars": "error",
      "@typescript-eslint/no-unused-vars": ["error"],
      // Custom rules
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", args: "after-used", ignoreRestSiblings: false },
      ],
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
      "import/no-extraneous-dependencies": "warn",
      "import/no-unresolved": "warn",
      "prefer-object-spread": "warn",
      "global-require": "warn",
      "import/no-dynamic-require": "warn",
      "no-plusplus": "warn",
      "no-underscore-dangle": "warn",
      "no-param-reassign": "warn",
      "@typescript-eslint/no-shadow": "warn",
      "array-callback-return": "warn",
      "default-case": "warn",
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
