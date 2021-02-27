import timerIcon from 'assets/timer.svg';
import Header2 from 'atoms/Header2';
import styled from 'styled-components';
import { colorPalette } from 'stylesheet';
import { ReactComponent as CheckIcon } from 'assets/check.svg';

export const PadStepDone = styled.div<{ height: number; width: number }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background-color: ${colorPalette.redTransparent};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  z-index: 28;
`;

export const CanvasContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

export const Canvas = styled.canvas<{
  pointCursor?: string;
  cursorPosition?: number;
  width: number;
  height: number;
}>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  box-shadow: 0 0 0 2px ${colorPalette.textGrey};
  border-radius: 16px;
  transform-origin: top;
  ${({ pointCursor, cursorPosition }) =>
    pointCursor &&
    cursorPosition &&
    `cursor: url(${pointCursor}) ${cursorPosition} ${cursorPosition}, auto`};
`;

export const StyledTimerIcon = styled.img.attrs({ src: timerIcon })`
  width: 80px;
  height: 80px;
  margin: 180px 0 32px 0;
`;

export const WhiteHeader = styled(Header2)`
  color: ${colorPalette.white};
`;

export const CanvasButtons = styled.div`
  display: flex;
  height: 400px;
  position: absolute;
  left: calc(100% + 16px);
`;

export const RightButtons = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

export const StyledCheckIcon = styled(CheckIcon)`
  cursor: pointer;
  margin: auto;
  margin-top: 15px;

  .main {
    fill: ${colorPalette.purple};
  }
`;

export const CanvasAndSaveContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
