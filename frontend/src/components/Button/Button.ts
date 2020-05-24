import styled, { css } from 'styled-components';
import { colorPalette, fontSize, fontFamily } from 'stylesheet';

const Button = styled.button`
  height: 51px;
  padding: 16px 32px;
  font-family: ${fontFamily.main};
  font-weight: bold;
  letter-spacing: 0.05em;
  background: linear-gradient(90deg, #ff9314 0%, #ff0080 100%);
  font-size: ${fontSize.medium};
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
    `}
  box-shadow: 4px 2px 10px 2px rgba(0,0,0,0.15);
  border: none;
  border-radius: 28px;
  color: ${colorPalette.white};
  background-color: ${(props) => (props.disabled ? colorPalette.black : colorPalette.red)};
  outline: none;

  &:active {
    box-shadow: inset -4px -2px 10px 2px rgba(0, 0, 0, 0.15);
  }
`;

export default Button;
