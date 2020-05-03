import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

export const CanvasWrapper = styled.div<{ width: number; height: number; hideBorder?: boolean }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: relative;
  ${({ hideBorder }) => !hideBorder && `border: 2px solid ${colorPalette.textGrey};`}
  border-radius: 16px;
`;
CanvasWrapper.displayName = 'CanvasWrapper';
