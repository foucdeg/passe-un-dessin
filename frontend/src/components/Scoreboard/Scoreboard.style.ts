import styled from 'styled-components';
import { fontSize, fontWeight, lineHeight } from 'stylesheet';
import Avatar from 'components/Avatar';
import BareLink from 'atoms/BareLink';

export const InnerScoreboard = styled.div`
  overflow-y: auto;
`;

export const RankingRow = styled.div`
  display: flex;
  line-height: 19px;
  align-items: center;
  margin-bottom: 8px;
`;

export const RankText = styled.span`
  font-size: ${fontSize.header2};
  width: 40px;
  text-align: center;
  margin-right: 8px;
  flex-shrink: 0;
`;

export const RankingDelta = styled.span`
  margin-left: 16px;
  flex-shrink: 0;
`;

export const RankingScore = styled.strong`
  margin-left: 16px;
  font-size: ${fontSize.header2};
  flex-shrink: 0;
`;

export const StyledAvatar = styled(Avatar)`
  margin-right: 16px;
  height: 60px;
  width: 60px;
  flex-shrink: 0;
`;

export const StyledLink = styled(BareLink)`
  min-width: 0; /* https://css-tricks.com/flexbox-truncated-text/ */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${fontSize.header2};
  line-height: ${lineHeight.large};
  font-weight: ${fontWeight.normal};
`;
