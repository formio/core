import globals from 'globals';
import pluginJs from '@eslint/js';
import mochaPlugin from 'eslint-plugin-mocha';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**/*',
      'lib/**/*',
      'coverage/**/*',
      '.github/**/*',
      'node_modules/**/*',
      'docs/**/*',
      'config/**/*',
      'src/experimental/**/*',
      'src/server/**/*',
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginJs.configs.recommended,
  mochaPlugin.configs.flat.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-prototype-builtins': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^ignore',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
