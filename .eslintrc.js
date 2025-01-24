module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'jest'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',  // اطمینان از استفاده از Prettier در کنار ESLint
    'plugin:eslint-comments/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/**', 'node_modules/**'],
  rules: {
    
    // قوانین نام‌گذاری متغیرها
    'camelcase': ['error', { properties: 'always' }],  // استفاده از camelCase برای نام‌گذاری متغیرها
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase'],  // استفاده از camelCase برای متغیرها
      },
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['UPPER_CASE'],  // استفاده از UPPER_CASE برای ثابت‌ها
      },
      {
        selector: 'function',
        format: ['camelCase'],  // استفاده از camelCase برای نام‌گذاری توابع
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'], // استفاده از PascalCase برای type alias ها
      },
      {
        selector: 'interface',
        format: ['PascalCase'], // استفاده از PascalCase برای interface ها
        prefix: ['I'],          // افزودن "I" به ابتدای نام interface ها
      },
      {
        selector: 'class',
        format: ['PascalCase'], // استفاده از PascalCase برای کلاس‌ها
      },
    ],

    // قوانین پیشرفته برای واردات
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-default-export': 'warn',  // ترجیح به استفاده از export های نام‌دار

    // قوانین Jest
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',

    // قوانین عمومی
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
