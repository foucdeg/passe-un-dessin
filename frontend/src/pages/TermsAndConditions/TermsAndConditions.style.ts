import styled from 'styled-components';

import { ReactComponent as arrowLeft } from 'assets/arrow-left.svg';

import { fontSize, fontFamily, colorPalette } from 'stylesheet';
import Header4 from 'atoms/Header4';
import Header3 from 'atoms/Header3';

export const LeftSideTitle = styled.h1`
  font-family: ${fontFamily.titles};
  font-size: ${fontSize.titles};
  color: ${colorPalette.purple};
  text-transform: uppercase;
  margin-bottom: 16px;
`;

export const Subtitle = styled(Header4)`
  color: ${colorPalette.orange};
  margin-bottom: 42px;
`;

export const Header = styled(Header3)`
  color: ${colorPalette.orange};
  margin: 32px 0;
  align-self: flex-start;
`;

export const LegalParagraph = styled.p`
  align-self: flex-start;
  margin-bottom: 24px;
`;

export const ArrowLeft = styled(arrowLeft)`
  cursor: pointer;
  margin-right: 16px;
  margin-left: -8px;

  .main {
    fill: ${colorPalette.orange};
  }
`;
