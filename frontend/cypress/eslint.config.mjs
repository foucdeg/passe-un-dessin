import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginCypress from 'eslint-plugin-cypress/flat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

// note: eslint v10 should support multiple configs in the same repo.
// In the meantime we could try the future flag:
// https://eslint.org/docs/latest/use/configure/configuration-files#experimental-configuration-file-resolution
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginCypress.configs.recommended,
  eslintPluginPrettierRecommended,
];
