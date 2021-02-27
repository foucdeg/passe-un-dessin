import styled, { css } from 'styled-components';
import { DrawingColor } from './BrushColorPicker';

export const BrushPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 15px;
  justify-content: space-between;
`;

export const ColorBlock = styled.div<{
  color: DrawingColor;
  selected: boolean;
  withBorder: boolean;
}>`
  background-color: ${(props) => props.color};
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  ${({ withBorder }) =>
    withBorder &&
    css`
      border: 1px solid black;
    `}
  ${({ selected }) =>
    selected &&
    css`
      border: 2px solid black;
    `}
`;
