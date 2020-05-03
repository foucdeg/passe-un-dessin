import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

export const CanvasWrapper = styled.div<{
  containerWidth: number;
  containerHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  hideBorder?: boolean;
}>`
  width: ${({ canvasWidth }) => canvasWidth}px;
  height: ${({ canvasHeight }) => canvasHeight}px;
  position: relative;
  ${({ hideBorder }) => !hideBorder && `border: 2px solid ${colorPalette.textGrey};`}
  border-radius: 16px;
  ${({ containerWidth, containerHeight, canvasHeight, canvasWidth }) =>
    `transform: scale(${containerWidth / canvasWidth}, ${containerHeight / canvasHeight})`};
  transform-origin: top;
`;
CanvasWrapper.displayName = 'CanvasWrapper';
