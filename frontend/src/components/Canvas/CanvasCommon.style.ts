import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

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
