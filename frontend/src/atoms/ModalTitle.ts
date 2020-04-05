import styled from 'styled-components';
import { fontFamily, colorPalette, fontSize } from 'stylesheet';

const ModalTitle = styled.h2`
  font-family: ${fontFamily.titles};
  color: ${colorPalette.purple};
  font-size: ${fontSize.smallTitles};
  text-transform: uppercase;
  margin-bottom: 18px;
  text-align: center;
`;

ModalTitle.displayName = 'ModalTitle';

export default ModalTitle;
