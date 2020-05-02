import styled, { css } from 'styled-components';
import { DrawingColor } from './BrushColorPicker';

export const BrushPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 15px;
  justify-content: space-between;
`;

export const ColorBlock = styled.div<{ color: DrawingColor; selected: boolean }>`
  background-color: ${props => props.color};
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  ${props =>
    props.selected &&
    css`
      border: 2px solid black;
    `}
`;
