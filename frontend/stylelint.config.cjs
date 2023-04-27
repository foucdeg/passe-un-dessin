module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-styled-components',
    'stylelint-config-prettier',
  ],
  customSyntax: 'postcss-styled-syntax',
  rules: {
    /*
     * These rules are here to prevent CSS bad practices.
     * Most of the time they introduce tech debt, checkout the links above each rule for more info.
     * When some of these rules are not relevant (there are rare edge cases), you can
     * // stylelint-disable-next-line
     * Check with a member of the CSS guild if you have any doubt
     */
    // https://github.com/theodo/theodo-code-principles/blob/master/css.md#no-important
    'declaration-no-important': true,
    // https://github.com/theodo/theodo-code-principles/blob/master/css.md#no-id-in-selectors
    'selector-max-id': 0,
    // https://github.com/theodo/theodo-code-principles/blob/master/css.md#no-more-than-two-classes-in-selectors
    'selector-max-class': 2,
    // https://github.com/theodo/theodo-code-principles/blob/master/css.md#no-html-tags-in-selectors
    'selector-max-type': 1,
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['/-styled-mixin/', '$dummyValue'],
      },
    ],
    'value-keyword-case': [
      'lower',
      {
        ignoreKeywords: ['dummyValue'],
      },
    ],
  },
};
