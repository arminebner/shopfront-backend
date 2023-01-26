module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    allowImportExportEverywhere: true,
    codeFrame: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/camelcase': ['error', { properties: 'never' }],
  },
  env: {
    es2021: true,
    node: true,
  },
}

/*
env: {
  es2021: true,
  node: true,
},
extends: ['standard-with-typescript', 'prettier'],
overrides: [],
parserOptions: {
  ecmaVersion: 'latest',
  sourceType: 'module',
},
plugins: ['@typescript-eslint', 'prettier'],
rules: {},

*/
