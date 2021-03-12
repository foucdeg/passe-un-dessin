import styled, { css } from 'styled-components';
import { colorPalette } from 'stylesheet';

export const Container = styled.button`
  min-width: 32px;
  height: 18px;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;
  position: relative;
  background-color: inherit;
`;

export const Rod = styled.div<{ selected: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${colorPalette.textGrey};
  border-radius: 15px;
  ${(props) =>
    props.selected &&
    css`
      background-color: ${colorPalette.lightPurple};
    `}
`;

export const Circle = styled.div<{ selected: boolean }>`
  border-radius: 50%;
  height: 18px;
  width: 20px;
  position: absolute;
  top: 0;
  right: 20px;
  background-color: ${({ selected }) => (selected ? colorPalette.purple : colorPalette.black)};
  ${({ selected }) => selected && 'right: 0;'}
  transition: right 0.2s;
`;
