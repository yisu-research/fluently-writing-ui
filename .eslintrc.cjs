/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@antfu',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: {
      js: '@babel/eslint-parser',
      jsx: '@babel/eslint-parser',

      ts: '@typescript-eslint/parser',
      tsx: '@typescript-eslint/parser',
    },
    requireConfigFile: false,
  },
  rules: {
    'prettier/prettier': 'error',
    'vue/valid-template-root': 'off',
    'vue/no-multiple-template-root': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['index', '401', '404'],
      },
    ],
    'no-undef': 'off',
  },
}
