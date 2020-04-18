import styled from 'styled-components';
import { fontFamily, fontSize } from 'stylesheet';

const Header2 = styled.h2`
  font-family: ${fontFamily.titles};
  font-size: ${fontSize.header2};
  text-transform: uppercase;
  line-height: 28px;
`;

Header2.displayName = 'Header2';

export default Header2;
