import styled from 'styled-components';
import rightSideBackground from 'assets/full-background.svg';

import { fontSize, fontFamily, colorPalette } from 'stylesheet';

export const LeftSide = styled.div`
  display: flex;
  height: 100%;
  width: 50%;
  flex-direction: column;
  align-items: center;
  padding: 48px;
`;

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

export const RightSideTitle = styled.h1`
  font-family: ${fontFamily.titles};
  font-size: ${fontSize.XXLarge};
  color: ${colorPalette.white};
  text-transform: uppercase;
  width: 200px;
  margin: auto;
`;

export const Credits = styled.p`
  color: ${colorPalette.white};
  font-variant: small-caps;
  text-transform: uppercase;
`;
