import styled, { css } from 'styled-components';
import fullBackground from 'assets/full-background.svg';
import { colorPalette } from 'stylesheet';
import PlayerChip from 'atoms/PlayerChip';

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
  min-height: 570px;
  margin: auto;
  background: ${colorPalette.white};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  position: relative;
  ${props =>
    props.hasTabs &&
    css`
      border-radius: 0 16px 16px 16px;
    `}
`;
InnerGameContainer.displayName = 'InnerGameContainer';

export const PlayerOrder = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  top: -45px;
  left: 0;
`;
PlayerOrder.displayName = 'PlayerOrder';

export const StyledPlayerChip = styled(PlayerChip)`
  color: ${colorPalette.black};
  font-weight: bold;
  margin: 0;
  margin-right: 4px;
`;

StyledPlayerChip.displayName = 'StyledPlayerChip';

export const ArrowSpacer = styled.img`
  margin-right: 4px;
`;

ArrowSpacer.displayName = 'ArrowSpacer';
