/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'alloy',
    'alloy/vue',
    'alloy/typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: {
      js: '@babel/eslint-parser',
      jsx: '@babel/eslint-parser',

      ts: '@typescript-eslint/parser',
      tsx: '@typescript-eslint/parser',

      // Leave the template parser unspecified, so that it could be determined by `<script lang="...">`
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'vue/valid-template-root': 'off',
    'vue/no-multiple-template-root': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
  }
}
