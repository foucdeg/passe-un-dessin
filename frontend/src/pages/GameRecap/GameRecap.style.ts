import styled from 'styled-components';
import { colorPalette } from 'stylesheet';
import { ThumbUpIcon } from 'components/ReactionOverlay/ReactionOverlay.style';

export const OuterRecapContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
  width: 100%;
`;

OuterRecapContainer.displayName = 'OuterRecapContainer';

export const GameRecapContainer = styled.div`
  display: flex;
`;

GameRecapContainer.displayName = 'GameRecapContainer';

export const PadTabsRow = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  top: -40px;
  left: 0;
`;

PadTabsRow.displayName = 'PadTabsRow';

export const VoteReminder = styled.div`
  color: ${colorPalette.white};
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  display: flex;
  line-height: 24px;
  font-weight: bold;
  align-items: center;
  justify-content: center;

  & > ${ThumbUpIcon} {
    margin-left: 8px;
  }
`;
