/** @type {import("eslint").Linter.Config} */
export default {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // Puoi metterlo su 'warn' o 'error' se vuoi più rigore
    '@typescript-eslint/no-empty-interface': 'off',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
