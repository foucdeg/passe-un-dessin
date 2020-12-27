import styled from 'styled-components';
import { colorPalette, fontSize } from 'stylesheet';
import googleLogo from 'assets/google.png';

export const Container = styled.div`
  width: 100%;
  height: 48px;
  margin-bottom: 16px;
`;

export const GoogleLogo = styled.img.attrs({ src: googleLogo })`
  height: 24px;
  margin-left: 9px;
`;

export const StyledGoogleButton = styled.button`
  outline: none;
  border: none;
  background-color: ${colorPalette.white};
  width: 100%;
  height: 48px;
  color: ${colorPalette.black};
  padding: 0;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  cursor: pointer;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
`;

export const TextContent = styled.span`
  flex-grow: 1;
  font-size: ${fontSize.header4};
`;
