import styled, { css } from 'styled-components';
import fullBackground from 'assets/full-background.svg';
import { colorPalette } from 'stylesheet';

export const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  background: url(${fullBackground});
  background-size: cover;
  padding: 62px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
GameContainer.displayName = 'GameContainer';

export const InnerGameContainer = styled.div<{ hasTabs?: boolean }>`
  width: 100%;
  height: 570px;
  background: ${colorPalette.white};
  border-radius: 16px;
  padding: 16px;
  position: relative;
  ${props =>
    props.hasTabs &&
    css`
      border-radius: 0 16px 16px 16px;
    `}
`;
InnerGameContainer.displayName = 'InnerGameContainer';
