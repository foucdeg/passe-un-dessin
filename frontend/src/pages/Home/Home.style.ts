import styled from 'styled-components';

import rightSideBackground from 'assets/full-background.svg';

import { fontSize, fontFamily, colorPalette } from 'stylesheet';
import Header4 from 'atoms/Header4';

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

export const Subtitle = styled(Header4)`
  color: ${colorPalette.orange};
  margin-bottom: 42px;
`;

Subtitle.displayName = 'Subtitle';

export const Attribution = styled.p`
  margin-top: 16px;
`;

Attribution.displayName = 'Attribution';

export const LegalLinks = styled.p`
  text-align: center;
  margin-top: 8px;
  font-size: ${fontSize.small};
  a {
    color: ${colorPalette.textGrey};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

LegalLinks.displayName = 'LegalLinks';

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

export const Row = styled.div`
  display: flex;
  width: 100%;
  max-width: 400px;
  justify-content: space-between;
`;

Row.displayName = 'Row';
