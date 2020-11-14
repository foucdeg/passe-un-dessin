/**
 * App spacing measurement convention
 * Use the getSpacing function below to compute padding and margin
 */
const SPACING_UNIT = 5;
const MEASUREMENT_UNIT = 'px';

/**
 * Do not use directly the colorPalette in your components
 * Create an entry in the colorUsage below instead
 */
export const colorPalette = {
  black: '#44374E',
  purple: '#9B37A9',
  lightPurple: '#cc99ff',
  textGrey: 'rgba(68, 55, 78, 0.4)',
  backgroundGrey: '#f1f1f1',
  amberLight: '#FFD54F',
  amber: '#FFC107',
  orange: '#F68D4F',
  blue: '#38cdff',
  blueLight: '#F4F9FB',
  white: '#FFFFFF',
  red: '#FF7373',
  redTransparent: 'rgba(255, 115, 115, 0.6)',
  blackTransparent: 'rgba(0, 0, 0, 0.24)',
  whiteTransparent: 'rgba(255, 255, 255, 0.8)',
  discord: '#7289DA',
};

export const fontFamily = {
  titles: `'Raleway', 'Helvetica', 'Arial', sans-serif`,
  main: `'Roboto Condensed', 'Helvetica', 'Arial', sans-serif`,
};

export const fontSize = {
  XXLarge: '60px',
  titles: '32px',
  header2: '24px',
  header3: '26px',
  header4: '15px',
  medium: '16px',
  small: '14px',
  XSmall: '12px',
};

export const fontWeight = {
  bold: '700',
  normal: '400',
  light: '300',
};

export const lineHeight = {
  large: '36px',
  medium: '24px',
  small: '12px',
};

export const borderRadius = {
  medium: '4px',
  large: '10px',
};

export const getSpacing = (multiplier: number): string =>
  `${multiplier * SPACING_UNIT}${MEASUREMENT_UNIT}`;
