import styled, { css } from 'styled-components';
import { DrawingColor } from './BrushColorPicker';

export const BrushPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 25;
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
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;
