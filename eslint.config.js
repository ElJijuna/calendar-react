import browserTs from 'super-configs/eslint/browser/ts';
import jestConfig from 'super-configs/eslint/jest';
import reactTsx from 'super-configs/eslint/react/tsx';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['dist/**', 'coverage/**', 'storybook-static/**', 'node_modules/**', '.changeset/**'],
  },
  ...browserTs,
  ...reactTsx,
  {
    files: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'jest.setup.ts'],
    ...jestConfig[0],
  },
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
];
