import styled from 'styled-components';
import { fontSize, fontWeight } from 'stylesheet';
import Avatar from 'components/Avatar';

export const InnerScoreboard = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

InnerScoreboard.displayName = 'InnerScoreboard';

export const PlayerName = styled.div`
  font-size: ${fontSize.header2};
  font-weight: ${fontWeight.normal};
`;
PlayerName.displayName = 'PlayerName';

export const RankingRow = styled.div`
  display: flex;
  line-height: 19px;
  align-items: center;
  margin-bottom: 8px;
`;
RankingRow.displayName = 'RankingRow';

export const RankText = styled.span`
  font-size: ${fontSize.header2};
  width: 40px;
  text-align: center;
  margin-right: 8px;
`;
RankText.displayName = 'RankText';

export const RankingScore = styled.strong`
  margin-left: 16px;
  font-size: ${fontSize.header2};
`;
RankingScore.displayName = 'RankingScore';

export const StyledAvatar = styled(Avatar)`
  margin-right: 16px;
  height: 60px;
  width: 60px;
`;
StyledAvatar.displayName = 'StyledAvatar';
