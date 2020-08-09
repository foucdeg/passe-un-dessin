import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { colorPalette, fontSize } from 'stylesheet';
import PlayerChip from 'atoms/PlayerChip';

export const ScoreboardContainer = styled.div`
  max-width: 300px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 auto;
`;

ScoreboardContainer.displayName = 'ScoreboardContainer';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
  margin-bottom: 32px;
  text-align: center;
`;

StyledHeader.displayName = 'StyledHeader';

export const InnerScoreboard = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

InnerScoreboard.displayName = 'InnerScoreboard';

export const StyledPlayeChip = styled(PlayerChip)`
  margin: 0;
`;

StyledHeader.displayName = 'StyledHeader';

export const RankingRow = styled.div`
  display: flex;
  line-height: 19px;
  align-items: center;
  margin-bottom: 8px;
`;

RankingRow.displayName = 'RankingRow';

export const RankEmoji = styled.span`
  font-size: ${fontSize.header2};
  margin-right: 8px;
  width: 24px;
`;

RankEmoji.displayName = 'RankEmoji';

export const RankingDelta = styled.span``;

RankingDelta.displayName = 'RankingDelta';

export const RankingScore = styled.strong`
  margin-left: 16px;
  font-size: ${fontSize.header2};
`;

RankingScore.displayName = 'RankingScore';
