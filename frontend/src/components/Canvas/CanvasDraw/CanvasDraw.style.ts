import timerIcon from 'assets/timer.svg';
import Header2 from 'atoms/Header2';
import styled from 'styled-components';
import { colorPalette } from 'stylesheet';
import { ReactComponent as CheckIcon } from 'assets/check.svg';

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
  z-index: 28;
`;

PadStepDone.displayName = 'PadStepDone';

export const CanvasContainer = styled.div`
  display: flex;
  align-items: center;
`;

CanvasContainer.displayName = 'CanvasContainer';

export const Canvas = styled.canvas<{
  pointCursor?: string;
  cursorPosition?: number;
  width: number;
  height: number;
}>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  border: 2px solid ${colorPalette.textGrey};
  border-radius: 16px;
  transform-origin: top;
  ${({ pointCursor, cursorPosition }) =>
    pointCursor &&
    cursorPosition &&
    `cursor: url(${pointCursor}) ${cursorPosition} ${cursorPosition}, auto`};
`;

Canvas.displayName = 'Canvas';

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

export const StyledCheckIcon = styled(CheckIcon)`
  cursor: pointer;
  margin: auto;
  margin-top: 15px;

  .main {
    fill: ${colorPalette.purple};
  }
`;
StyledCheckIcon.displayName = 'StyledCheckIcon';

export const CanvasAndSaveContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
CanvasAndSaveContainer.displayName = 'CanvasAndSaveContainer';
