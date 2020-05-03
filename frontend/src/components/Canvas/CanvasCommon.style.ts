import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

export const Canvas = styled.canvas<{
  pointCursor?: string;
  cursorPosition?: number;
  containerWidth: number;
  containerHeight: number;
  width: number;
  height: number;
  hideBorder?: boolean;
}>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  ${({ pointCursor, cursorPosition }) =>
    pointCursor &&
    cursorPosition &&
    `cursor: url(${pointCursor}) ${cursorPosition} ${cursorPosition}, auto`};
  ${({ containerWidth, width }) => `border-radius: ${(16 * width) / containerWidth}px;`}
  ${({ hideBorder }) => !hideBorder && `border: 2px solid ${colorPalette.textGrey};`}
  ${({ containerWidth, containerHeight, height, width }) =>
    `transform: scale(${containerWidth / width}, ${containerHeight / height})`};
  transform-origin: top;
`;

Canvas.displayName = 'Canvas';
