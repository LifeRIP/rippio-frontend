import js from '@eslint/js';
import react from '@eslint-react/eslint-plugin';
import hooks from 'eslint-plugin-react-hooks';
import refresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  { ignores: ['dist/**', 'node_modules/**', 'cypress/screenshots/**', 'cypress/videos/**'] },
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [react.configs.recommended, hooks.configs.flat.recommended],
    plugins: { 'react-refresh': refresh },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['cypress/**/*.js'],
    languageOptions: { globals: { cy: 'readonly', Cypress: 'readonly', expect: 'readonly', ...globals.mocha } },
  },
);
