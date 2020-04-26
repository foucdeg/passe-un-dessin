import styled, { css } from 'styled-components';
import { colorPalette } from 'stylesheet';

export const StyledStaticInput = styled.div<{ hasAdornment: boolean }>`
  background: none;
  padding: 0 24px;
  line-height: 19px;
  width: 100%;
  text-align: left;
  ${props =>
    props.hasAdornment &&
    css`
      padding-right: 52px;
    `}
`;

StyledStaticInput.displayName = 'StyledStaticInput';

export const AdornmentLocation = styled.div`
  margin-right: 16px;
`;

export const InputAndAdornment = styled.div`
  border: 2px solid ${colorPalette.purple};
  border-radius: 16px;
  height: 51px;
  position: relative;
  display: flex;
  align-items: center;
`;
