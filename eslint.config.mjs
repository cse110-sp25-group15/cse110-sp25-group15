import js from '@eslint/js';
import globals from 'globals';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';
import html from '@html-eslint/eslint-plugin';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'no-console': 'warn',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'arrow-parens': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      'no-multiple-empty-lines': ['error', { 'max': 1 }],
    },
  },
  {
    ...html.configs['flat/recommended'],
    files: ['**/*.html'],
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { files: ['**/*.md'], plugins: { markdown }, language: 'markdown/gfm', extends: ['markdown/recommended'] },
  { files: ['**/*.css'], plugins: { css }, language: 'css/css', extends: ['css/recommended'] },
]);