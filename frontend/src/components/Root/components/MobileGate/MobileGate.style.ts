import styled from 'styled-components';

import { fontFamily, colorPalette, fontSize } from 'stylesheet';
import rightSideBackground from 'assets/full-background.svg';
import arrowRight from 'assets/arrow-right.svg';
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

MobileGateBackground.displayName = 'MobileGateBackground';

export const StyledHeader = styled.h1`
  font-family: ${fontFamily.titles};
  font-size: ${fontSize.XXLarge};
  color: ${colorPalette.white};
  text-transform: uppercase;
  margin-bottom: 32px;
`;

StyledHeader.displayName = 'StyledHeader';

export const LaptopTablet = styled.img.attrs({ src: laptopAndTablet })``;

LaptopTablet.displayName = 'LaptopTablet';

export const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

StyledForm.displayName = 'StyledForm';

export const InputArrow = styled.img.attrs({ src: arrowRight })`
  cursor: pointer;
`;

InputArrow.displayName = 'InputArrow';
