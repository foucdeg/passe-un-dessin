import styled from 'styled-components';
import { colorPalette } from 'stylesheet';
import { ThumbUpButton } from 'pages/GameRecap/components/ReactionOverlay/ReactionOverlay.style';

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

export const TopRow = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  top: -40px;
  left: 0;
  height: 40px;
`;

TopRow.displayName = 'TopRow';

export const PadTabs = styled.div`
  display: flex;
  flex-wrap: wrap-reverse;
`;

PadTabs.displayName = 'PadTabs';

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

  & > ${ThumbUpButton} {
    margin-left: 8px;
  }
`;
