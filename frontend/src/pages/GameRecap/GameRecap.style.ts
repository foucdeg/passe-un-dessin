import styled from 'styled-components';
import { colorPalette } from 'stylesheet';
import { ThumbUpButton } from 'pages/GameRecap/components/ReactionOverlay/ReactionOverlay.style';
import SecondaryButton from 'atoms/SecondaryButton';

export const OuterRecapContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  width: 100%;
`;

export const GameRecapContainer = styled.div`
  display: flex;
  max-height: 100%;
`;

export const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  top: -40px;
  left: 0;
  height: 40px;
`;

export const PadTabs = styled.div`
  display: flex;
  flex-wrap: wrap-reverse;
`;

export const StartVotingPhase = styled(SecondaryButton)`
  height: 32px;
  padding: 0 16px;
  margin-left: 8px;
  white-space: nowrap;
`;

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
