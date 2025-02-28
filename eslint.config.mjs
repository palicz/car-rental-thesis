import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  eslintPluginUnicorn.configs.recommended,
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'plugin:prettier/recommended',
      'plugin:playwright/recommended',
      'plugin:import/recommended',
    ],
    plugins: ['simple-import-sort'],
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          trailingComma: 'all',
        },
      ],
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^geist/font/.*'],
        },
      ],
    },
    overrides: [
      {
        files: ['*.js'],
        rules: {
          'unicorn/prefer-module': 'off',
        },
      },
    ],
  }),
];

export default eslintConfig;
