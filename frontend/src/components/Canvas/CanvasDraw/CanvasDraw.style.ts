import timerIcon from 'assets/timer.svg';
import Header2 from 'atoms/Header2';
import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

export const PadStepDone = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: ${colorPalette.redTransparent};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  z-index: 101;
`;

PadStepDone.displayName = 'PadStepDone';

export const StyledTimerIcon = styled.img.attrs({ src: timerIcon })`
  width: 80px;
  height: 80px;
  margin: 180px 0 32px 0;
`;

StyledTimerIcon.displayName = 'StyledTimerIcon';

export const WhiteHeader = styled(Header2)`
  color: ${colorPalette.white};
`;

WhiteHeader.displayName = 'WhiteHeader';

export const CanvasButtons = styled.div`
  display: flex;
  height: 400px;
`;

CanvasButtons.displayName = 'CanvasButtons';

export const RightButtons = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

RightButtons.displayName = 'RightButtons';
