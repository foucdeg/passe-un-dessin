import styled from 'styled-components';
import { colorPalette, fontFamily, fontSize } from 'stylesheet';

import fastForwardIcon from 'assets/fast-forward.svg';

export const ChipButton = styled.button`
  border: 2px solid ${colorPalette.orange};
  color: ${colorPalette.orange};
  background: ${colorPalette.white};
  height: 36px;
  padding: 0 14px;
  border-radius: 18px;
  outline: none;
  line-height: 19px;
  font-size: ${fontSize.medium};
  font-family: ${fontFamily.main};
  display: flex;
  align-items: center;
  cursor: pointer;
  box-shadow: 4px 2px 10px 2px rgba(0, 0, 0, 0.15);

  &:active {
    box-shadow: inset -4px -2px 10px 2px rgba(0, 0, 0, 0.15);
  }
`;

export default ChipButton;

export const NextStepIcon = styled.img.attrs({ src: fastForwardIcon })`
  margin-left: 8px;
`;
