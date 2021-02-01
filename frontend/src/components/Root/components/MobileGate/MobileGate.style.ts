import styled from 'styled-components';

import { fontFamily, colorPalette, fontSize } from 'stylesheet';
import rightSideBackground from 'assets/full-background.svg';
import laptopAndTablet from 'assets/laptop-tablet.svg';

export const MobileGateBackground = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 32px 24px 64px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url(${rightSideBackground});
  background-size: cover;
  text-align: center;
  font-family: ${fontFamily.main};
  color: ${colorPalette.black};
`;

export const StyledHeader = styled.h1`
  font-family: ${fontFamily.titles};
  font-size: ${fontSize.XXLarge};
  color: ${colorPalette.white};
  text-transform: uppercase;
  margin-bottom: 32px;
`;

export const LaptopTablet = styled.img.attrs({ src: laptopAndTablet })``;

export const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
