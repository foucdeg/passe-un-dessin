import styled from 'styled-components';

import rightSideBackground from 'assets/full-background.svg';
import { fontSize, fontFamily, colorPalette } from 'stylesheet';
import Button from 'components/Button';

export const LeftSide = styled.div`
  display: flex;
  height: 100%;
  width: 50%;
  flex-direction: column;
  align-items: center;
  padding: 48px;
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

export const Subtitle = styled.h3`
  font-size: ${fontSize.medium};
  color: ${colorPalette.orange};
  text-transform: uppercase;
  font-variant: small-caps;
  margin-bottom: 68px;
`;

Subtitle.displayName = 'Subtitle';

export const Header = styled.h2`
  font-size: ${fontSize.titles};
  color: ${colorPalette.orange};
  text-transform: uppercase;
  font-variant: small-caps;
  margin-bottom: 24px;
  align-self: flex-start;
`;

Header.displayName = 'Header';

export const HelpParagraph = styled.p`
  font-size: ${fontSize.medium};
  color: ${colorPalette.black};
  text-align: center;
  margin-bottom: 32px;
  line-height: 20px;
`;

HelpParagraph.displayName = 'HelpParagraph';

export const StartButton = styled(Button)`
  align-self: flex-end;
`;

StartButton.displayName = 'HelpPaStartButtonragraph';

export const RightSide = styled.div`
  display: flex;
  height: 100%;
  width: 50%;
  flex-direction: column;
  align-items: center;
  background: url(${rightSideBackground});
  background-size: cover;
  position: relative;
  padding: 24px;
`;
RightSide.displayName = 'RightSide';

export const RightSideTitle = styled.h1`
  font-family: ${fontFamily.titles};
  font-size: ${fontSize.XXLarge};
  color: ${colorPalette.white};
  text-transform: uppercase;
  width: 156px;
  word-wrap: break-word;
  text-align: justify;
  margin: auto;
`;

RightSideTitle.displayName = 'RightSideTitle';

export const Credits = styled.p`
  font-size: ${fontSize.medium};
  color: ${colorPalette.white};
  font-variant: small-caps;
  text-transform: uppercase;
  transform: rotate(-90deg);
  transform-origin: bottom left;
  position: absolute;
  bottom: 24px;
  right: -250px;
`;
Credits.displayName = 'Credits';

export const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 64px;
`;
ButtonRow.displayName = 'ButtonRow';
