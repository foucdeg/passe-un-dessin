import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { colorPalette } from 'stylesheet';
import InnerGameContainer from 'layout/GameLayout/InnerGameContainer';
import ScoreCard from 'modals/PlayerModal/components/ScoreCard';
import HorizontalSeparator from 'atoms/HorizontalSeparator';
import Avatar from 'components/Avatar';

const LEFT_COLUMN_WIDTH = 160;

export const LeftSide = styled.div`
  height: 100%;
  width: ${LEFT_COLUMN_WIDTH}px;
  display: flex;
  align-items: center;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 32px;
  text-align: center;
`;
LeftSide.displayName = 'LeftSide';

export const RightSide = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;
RightSide.displayName = 'RightSide';

export const StyledInnerContainer = styled(InnerGameContainer)`
  display: flex;
`;
StyledInnerContainer.displayName = 'StyledInnerContainer';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
`;
StyledHeader.displayName = 'StyledHeader';

export const StyledScoreCard = styled(ScoreCard)`
  margin-top: 10px;
  width: ${LEFT_COLUMN_WIDTH}px;
  height: ${LEFT_COLUMN_WIDTH}px;
`;
StyledScoreCard.displayName = 'StyledScoreCard';

export const SyledSeparator = styled(HorizontalSeparator)`
  margin-bottom: 16px;

  &:not(:first-child) {
    margin-top: 16px;
  }
`;
SyledSeparator.displayName = 'SyledSeparator';

export const HistoryGame = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
`;
HistoryGame.displayName = 'HistoryGame';

export const PlayerChips = styled.div`
  display: flex;
  flex-flow: wrap;
  margin-left: 16px;
`;
PlayerChips.displayName = 'PlayerChips';

export const StyledAvatar = styled(Avatar)`
  margin-bottom: 10px;
  width: ${LEFT_COLUMN_WIDTH}px;
  height: ${LEFT_COLUMN_WIDTH}px;
`;
StyledAvatar.displayName = 'StyledAvatar';
