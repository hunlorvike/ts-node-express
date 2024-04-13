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
      "no-unused-vars": "off",
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
      "import/no-extraneous-dependencies": "off",
      "import/no-unresolved": "off",
      "prefer-object-spread": "off",
      "global-require": "off",
      "import/no-dynamic-require": "off",
      "no-plusplus": "off",
      "no-underscore-dangle": "off",
      "no-param-reassign": "off",
      "@typescript-eslint/no-shadow": "off",
      "array-callback-return": "off",
      "default-case": "off",
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
