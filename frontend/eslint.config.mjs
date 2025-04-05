import tseslint from 'typescript-eslint';

import mysticatea from 'eslint-plugin-mysticatea';
import preferObjectSpread from 'eslint-plugin-prefer-object-spread';

import risxss from 'eslint-plugin-risxss';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslint from '@eslint/js';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  pluginReactHooks.configs['recommended-latest'],
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  importPlugin.flatConfigs.react,
  {
    plugins: {
      mysticatea,
      'prefer-object-spread': preferObjectSpread,
      risxss,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.mocha,
        ...globals.node,
        alert: true,
        document: true,
        localStorage: true,
        navigator: true,
        window: true,
        HTMLElement: true,
      },
    },

    rules: {
      'prettier/prettier': 'error',
      'import/extensions': 'off',

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],

      'import/order': ['error'],
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'import/no-named-as-default': 'off',
      'mysticatea/no-useless-rest-spread': 'error',
      'prefer-object-spread/prefer-object-spread': 'error',
      'react/destructuring-assignment': 'off',

      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.ts', '.tsx'],
        },
      ],

      'react/no-array-index-key': 'error',
      'react/jsx-key': 'error',
      'react/prefer-stateless-function': 'off',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
      complexity: 'off',
      'max-lines': ['error', 300],
      'max-depth': ['error', 4],
      'max-params': ['error', 10],
      'risxss/catch-potential-xss-react': 'error',
    },
  },
);
