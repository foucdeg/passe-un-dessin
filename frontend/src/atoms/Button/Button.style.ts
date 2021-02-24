import styled, { css } from 'styled-components';
import { colorPalette, fontSize, fontFamily } from 'stylesheet';
import { Link } from 'react-router-dom';

const commonStyles = css`
  height: 51px;
  padding: 16px 32px;
  font-family: ${fontFamily.main};
  font-weight: bold;
  letter-spacing: 0.05em;
  background: linear-gradient(90deg, #ff9314 0%, #ff0080 100%);
  font-size: ${fontSize.medium};
  box-shadow: 4px 2px 10px 2px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  border: none;
  border-radius: 28px;
  color: ${colorPalette.white};
  outline: none;

  &:active {
    box-shadow: inset -4px -2px 10px 2px rgba(0, 0, 0, 0.15);
  }
`;

export const BaseStyledButton = styled.button`
  ${commonStyles}
  ${(props) =>
    props.disabled &&
    css`
      cursor: default;
      color: ${colorPalette.textGrey};
      pointer-events: none;
      background: ${colorPalette.backgroundGrey};
      border: 2px solid ${colorPalette.textGrey};
      box-shadow: none;
      padding: 14px 30px;
    `}
`;

export const BaseStyledLink = styled(Link)`
  ${commonStyles}
  text-decoration: none;
`;
