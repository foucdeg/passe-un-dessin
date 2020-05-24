import styled, { css } from 'styled-components';

export const BrushPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BrushBlock = styled.img<{ selected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  ${(props) =>
    props.selected &&
    css`
      border: 2px solid black;
    `}
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;
