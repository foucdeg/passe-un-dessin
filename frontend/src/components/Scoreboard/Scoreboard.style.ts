import styled from 'styled-components';
import { fontSize, fontWeight } from 'stylesheet';
import Avatar from 'components/Avatar';

export const InnerScoreboard = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

InnerScoreboard.displayName = 'InnerScoreboard';

export const PlayerName = styled.div<{ isBig: boolean | undefined }>`
  font-size: ${fontSize.header2};
  font-weight: ${({ isBig }) => (isBig ? fontWeight.bold : fontWeight.normal)};
`;
PlayerName.displayName = 'PlayerName';

export const RankingRow = styled.div`
  display: flex;
  line-height: 19px;
  align-items: center;
  margin-bottom: 8px;
`;
RankingRow.displayName = 'RankingRow';

export const RankEmoji = styled.span`
  font-size: ${fontSize.titles};
  width: 40px;
  margin-right: 8px;
`;
RankEmoji.displayName = 'RankEmoji';

export const RankText = styled.span`
  font-size: ${fontSize.titles};
  width: 40px;
  text-align: center;
  margin-right: 8px;
`;
RankText.displayName = 'RankText';

export const RankingScore = styled.strong<{ isBig: boolean | undefined }>`
  margin-left: 16px;
  font-size: ${({ isBig }) => (isBig ? fontSize.titles : fontSize.header2)};
`;
RankingScore.displayName = 'RankingScore';

export const StyledAvatar = styled(Avatar)`
  margin-right: 16px;
`;
StyledAvatar.displayName = 'StyledAvatar';
