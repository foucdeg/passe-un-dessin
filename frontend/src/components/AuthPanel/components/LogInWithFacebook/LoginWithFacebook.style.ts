import styled from 'styled-components';
import { colorPalette, fontSize } from 'stylesheet';
import facebookLogo from 'assets/facebook.png';

const facebookBlue = '#3578ea';

export const FacebookLogo = styled.img.attrs({ src: facebookLogo })`
  height: 24px;
  margin-left: 9px;
`;

export const StyledFacebookButton = styled.button`
  outline: none;
  border: none;
  background-color: ${facebookBlue};
  width: 100%;
  height: 48px;
  color: ${colorPalette.white};
  padding: 0;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  cursor: pointer;
  margin-bottom: 16px;
  display: flex;
  align-items: center;

  &[disabled] {
    background-color: ${colorPalette.backgroundGrey};
    color: ${colorPalette.textGrey};
  }
`;

export const TextContent = styled.span`
  flex-grow: 1;
  font-size: ${fontSize.header4};
`;
