import js from '@eslint/js';
import globals from 'globals';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
//import jsonPlugin from '@eslint/json';
import { defineConfig } from 'eslint/config';
import html from '@html-eslint/eslint-plugin';

export default defineConfig([
  
  {
    ignores: ['docs/**, src/dist/**'], // Ignore docs and dist directories
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      // Enable globals for browser and Node.js environments
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'arrow-parens': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      'no-multiple-empty-lines': ['error', { 'max': 1 }],
    },
  },

  // Treat .js files as scripts (module)
  {
    ignores: ['docs/**'], 
    files: ['**/*.js'],
    languageOptions: { sourceType: 'module' },
  },

  // HTML Linting Configuration
  {
    ignores: ['docs/**'], 
    ...html.configs['flat/recommended'],
    files: ['**/*.html'],
  },

  // CSS Linting Configuration
  {
    ignores: ['docs/**'], 
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
  },

  // JSON Linting Configuration (bugged)
  //{
  //  files: ['**/*.json'],
  //  plugins: { json: jsonPlugin },
  //  languageOptions: {
  //    parser: jsonPlugin.parser,
  //  },
  //},

  // Markdown Linting Configuration
  {
    ignores: ['docs/**'], 
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },
  // Test Linting Configuration
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: globals.jest,
    },
  },
]);
