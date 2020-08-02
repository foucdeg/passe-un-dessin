import styled from 'styled-components';
import arrowRight from 'assets/arrow-right.svg';

export const PLAYER_COLORS = {
  '#9337AE': 'purple',
  '#60DAFF': 'lightBlue',
  '#62FAD3': 'lightGreen',
  '#8A80F1': 'mauve',
  '#FF9314': 'orange',
  '#FF5257': 'bloodOrange',
  '#FDC737': 'yellow',
  '#FF0080': 'fuschia',
};

console.log(Object.entries(PLAYER_COLORS));

export const InputArrow = styled.img.attrs({ src: arrowRight })`
  cursor: pointer;
`;

InputArrow.displayName = 'InputArrow';
