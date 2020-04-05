import styled from 'styled-components';
import { fontFamily, colorPalette } from 'stylesheet';

export const RootContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  font-family: ${fontFamily.main};
  color: ${colorPalette.black};
`;
RootContainer.displayName = 'RootContainer';
