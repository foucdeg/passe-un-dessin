import styled, { css } from 'styled-components';
import { DrawingColor } from './BrushColorPicker';

export const BrushPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 15px;
  justify-content: space-between;
`;

export const ColorBlock = styled.div<{
  color: DrawingColor;
  selected: boolean;
  withBorder: boolean;
}>`
  background-color: ${props => props.color};
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  ${({ selected, withBorder }) =>
    (selected || withBorder) &&
    css`
      border: ${selected ? 2 : 1}px solid black;
    `}
`;
