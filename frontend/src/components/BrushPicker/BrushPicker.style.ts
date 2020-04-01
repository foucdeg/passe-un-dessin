import styled, { css } from 'styled-components';
import { DrawingColor } from './BrushPicker';

export const BrushPickerContainer = styled.div`
  display: flex;
`;

export const ColorBlock = styled.div<{ color: DrawingColor; selected: boolean }>`
  background-color: ${props => props.color};
  width: 24px;
  height: 24px;
  border-radius: 12px;
  ${props =>
    props.selected &&
    css`
      border: 2px solid black;
    `}
`;

export const Eraser = styled.div<{ selected: boolean }>`
  border: ${props => (props.selected ? '2px' : '1px')} solid black;
  width: 24px;
  height: 24px;
  border-radius: 3px;
`;
