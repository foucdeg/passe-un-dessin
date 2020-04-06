import styled from 'styled-components';
import { colorPalette, fontFamily, fontSize } from 'stylesheet';

const Header2 = styled.h2`
  color: ${colorPalette.purple};
  font-family: ${fontFamily.titles};
  font-size: ${fontSize.smallTitles};
  text-transform: uppercase;
`;

Header2.displayName = 'Header2';

export default Header2;
