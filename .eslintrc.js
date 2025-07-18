module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "react-app", "react-app/jest"],
  plugins: ["unused-imports"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-console": "off",
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "off",
    "unused-imports/no-unused-vars": "off",
    "no-prototype-builtins": "warn",
    "no-empty": "warn",
    "no-case-declarations": "warn",
    "no-useless-catch": "warn",
    "no-prototype-builtins": "off",
  },
};
