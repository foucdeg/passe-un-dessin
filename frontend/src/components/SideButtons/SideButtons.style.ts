import styled from 'styled-components';

import playerIcon from 'assets/person.svg';
import cogIcon from 'assets/cog.svg';
import rankingIcon from 'assets/ranking.svg';
import refreshIcon from 'assets/refresh.svg';

export const SideButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 32px;
  top: 32px;
  z-index: 25;
`;

export const PlayerModalButton = styled.img.attrs({ src: playerIcon })`
  cursor: pointer;
  margin-bottom: 24px;
`;

PlayerModalButton.displayName = 'PlayerModalButton';

export const AdminModalButton = styled.img.attrs({ src: cogIcon })`
  cursor: pointer;
  margin-bottom: 24px;
`;

AdminModalButton.displayName = 'AdminModalButton';

export const RankingModalButton = styled.img.attrs({ src: rankingIcon })`
  cursor: pointer;
  margin-bottom: 24px;
`;

RankingModalButton.displayName = 'RankingModalButton';

export const RefreshButton = styled.img.attrs({ src: refreshIcon })`
  cursor: pointer;
`;

RefreshButton.displayName = 'RefreshButton';
