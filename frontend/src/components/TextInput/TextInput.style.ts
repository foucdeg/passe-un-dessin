import styled, { css } from 'styled-components';
import { fontSize, colorPalette } from 'stylesheet';

export const StyledTextInput = styled.input<{ hasAdornment: boolean }>`
  border: 2px solid ${colorPalette.purple};
  border-radius: 16px;
  padding: 16px 24px;
  font-size: ${fontSize.medium};
  width: 100%;

  &[readonly] {
    color: ${colorPalette.textGrey};
  }

  ${props =>
    props.hasAdornment &&
    css`
      padding-right: 52px;
    `}
`;

export const AdornmentLocation = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
`;

export const InputAndAdornment = styled.div`
  position: relative;
  display: flex;
`;
