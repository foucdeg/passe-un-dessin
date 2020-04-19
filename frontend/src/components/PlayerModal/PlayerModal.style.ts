import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { colorPalette } from 'stylesheet';
import arrowRight from 'assets/arrow-right.svg';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 16px;
`;

StyledHeader.displayName = 'StyledHeader';

export const InputArrow = styled.img.attrs({ src: arrowRight })`
  cursor: pointer;
`;

InputArrow.displayName = 'InputArrow';
