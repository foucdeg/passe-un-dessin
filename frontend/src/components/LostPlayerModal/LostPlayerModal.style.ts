import styled from 'styled-components';
import { colorPalette } from 'stylesheet';
import Header2 from 'atoms/Header2';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 24px;
`;

StyledHeader.displayName = 'StyledHeader';
