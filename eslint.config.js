import js from '@eslint/js';
import globals from 'globals';
import tailwind from 'eslint-plugin-tailwindcss';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        $: 'readonly',
        jQuery: 'readonly',
      },
    },
  },
  ...tailwind.configs['flat/recommended'],
]);
