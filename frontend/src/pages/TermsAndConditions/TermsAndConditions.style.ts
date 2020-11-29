import styled from 'styled-components';

import rightSideBackground from 'assets/full-background.svg';
import { ReactComponent as arrowLeft } from 'assets/arrow-left.svg';

import { fontSize, fontFamily, colorPalette } from 'stylesheet';
import Header4 from 'atoms/Header4';
import Header3 from 'atoms/Header3';

export const LeftSide = styled.div`
  display: flex;
  height: 100vh;
  width: 50%;
  flex-direction: column;
  align-items: center;
  padding: 48px;
  overflow-y: auto;
`;
LeftSide.displayName = 'LeftSide';

export const LeftSideTitle = styled.h1`
  font-family: ${fontFamily.titles};
  font-size: ${fontSize.titles};
  color: ${colorPalette.purple};
  text-transform: uppercase;
  margin-bottom: 16px;
`;

LeftSideTitle.displayName = 'LeftSideTitle';

export const Subtitle = styled(Header4)`
  color: ${colorPalette.orange};
  margin-bottom: 42px;
`;

Subtitle.displayName = 'Subtitle';

export const Header = styled(Header3)`
  color: ${colorPalette.orange};
  margin: 32px 0;
  align-self: flex-start;
`;

Header.displayName = 'Header';

export const RightSide = styled.div`
  display: flex;
  height: 100%;
  width: 50%;
  flex-direction: column;
  align-items: center;
  background: url(${rightSideBackground});
  background-size: cover;
  position: relative;
  padding: 48px;
`;
RightSide.displayName = 'RightSide';

export const RightSideTitle = styled.h1`
  font-family: ${fontFamily.titles};
  font-size: ${fontSize.XXLarge};
  color: ${colorPalette.white};
  text-transform: uppercase;
  width: 200px;
  margin: auto;
`;

RightSideTitle.displayName = 'RightSideTitle';

export const Credits = styled.p`
  color: ${colorPalette.white};
  font-variant: small-caps;
  text-transform: uppercase;
`;
Credits.displayName = 'Credits';

export const LegalParagraph = styled.p`
  align-self: flex-start;
  margin-bottom: 24px;
`;
LegalParagraph.displayName = 'LegalParagraph';

export const ArrowLeft = styled(arrowLeft)`
  cursor: pointer;
  margin-right: 16px;
  margin-left: -8px;

  .main {
    fill: ${colorPalette.orange};
  }
`;
ArrowLeft.displayName = 'ArrowLeft';
