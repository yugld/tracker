/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {},
  globals: {},
  extends: ['ts-prefixer', 'plugin:jsx-a11y/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
  },
  plugins: ['react-hooks', 'jsx-a11y', '@stylistic'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'prettier/prettier': [
      'error',
      {
        semi: true,
        endOfLine: 'auto',
      },
    ],
    '@typescript-eslint/promise-function-async': [
      'error',
      {
        checkArrowFunctions: false,
      },
    ],
    curly: ['error', 'all'],
    'prefer-const': 'error',
    'no-var': 'error',
    'no-shadow-restricted-names': 'error',
    'no-console': 'warn',
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: '*', next: 'return' },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['enum', 'interface', 'type'],
      },
      {
        blankLine: 'always',
        prev: ['enum', 'interface', 'type'],
        next: '*',
      },
    ],
  },
  settings: {},
  overrides: [],
};
