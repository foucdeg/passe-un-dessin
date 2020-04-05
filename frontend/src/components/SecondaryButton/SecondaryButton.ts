import styled, { css } from 'styled-components';
import { colorPalette, fontSize } from 'stylesheet';

const SecondaryButton = styled.button`
  height: 56px;
  padding: 18px 32px;
  background: white;
  font-size: ${fontSize.medium};
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  ${props =>
    props.disabled &&
    css`
      pointer-events: none;
    `}

  border: 2px solid #ff9314;
  border-radius: 28px;
  color: #ff9314;
  background-color: ${colorPalette.white};
  outline: none;
`;

export default SecondaryButton;
