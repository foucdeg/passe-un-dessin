import styled from 'styled-components';
import { fontSize } from 'stylesheet';
import PlayerChip from 'atoms/PlayerChip';

export const InnerScoreboard = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

InnerScoreboard.displayName = 'InnerScoreboard';

export const StyledPlayeChip = styled(PlayerChip)`
  margin: 0;
`;

StyledPlayeChip.displayName = 'StyledPlayeChip';

export const RankingRow = styled.div`
  display: flex;
  line-height: 19px;
  align-items: center;
  margin-bottom: 8px;
`;

RankingRow.displayName = 'RankingRow';

export const RankEmoji = styled.span`
  font-size: ${fontSize.header2};
  width: 24px;
  margin-right: 8px;
`;

RankEmoji.displayName = 'RankEmoji';

export const RankText = styled.span`
  text-align: center;
  width: 24px;
  margin-right: 8px;
`;

RankText.displayName = 'RankText';

export const RankingDelta = styled.span``;

RankingDelta.displayName = 'RankingDelta';

export const RankingScore = styled.strong`
  margin-left: 16px;
  font-size: ${fontSize.header2};
`;

RankingScore.displayName = 'RankingScore';
