import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

export const Container = styled.button`
  width: 40px;
  height: 18px;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;
  position: relative;
  background-color: inherit;
`;
Container.displayName = 'Container';

export const Rod = styled.div<{ selected: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${({ selected }) =>
    selected ? colorPalette.lightPurple : colorPalette.textGrey};
  border-radius: 15px;
`;
Rod.displayName = 'Rod';

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
Circle.displayName = 'Circle';
