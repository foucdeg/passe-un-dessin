import Header2 from 'atoms/Header2';
import styled from 'styled-components';

import { fontSize, fontFamily, colorPalette } from 'stylesheet';

export const LeftSideTitle = styled.h1`
  font-family: ${fontFamily.titles};
  font-size: ${fontSize.titles};
  color: ${colorPalette.purple};
  text-transform: uppercase;
  margin-bottom: 64px;
`;

export const StyledHeader = styled(Header2)`
  text-align: center;
  margin-bottom: 32px;
`;
