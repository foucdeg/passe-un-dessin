import styled, { css } from 'styled-components';
import { DrawingColor } from './BrushPicker';

export const BrushPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 100;
`;

export const ColorBlock = styled.div<{ color: DrawingColor; selected: boolean }>`
  background-color: ${props => props.color};
  width: 24px;
  height: 24px;
  border-radius: 4px;
  ${props =>
    props.selected &&
    css`
      border: 2px solid black;
    `}
  margin-bottom: 16px;
`;

export const Eraser = styled.div<{ selected: boolean }>`
  border: ${props => (props.selected ? '2px' : '1px')} solid black;
  width: 24px;
  height: 24px;
  border-radius: 4px;
`;
