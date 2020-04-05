import styled from 'styled-components';
import rightSideBackground from 'assets/right-side-background.svg';
import { colorPalette } from 'stylesheet';

export const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  background: url(${rightSideBackground});
  background-size: cover;
  padding: 62px;
`;
GameContainer.displayName = 'GameContainer';

export const InnerGameContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  background: ${colorPalette.white};
  border-radius: 16px;
  padding: 32px;
`;
InnerGameContainer.displayName = 'InnerGameContainer';
