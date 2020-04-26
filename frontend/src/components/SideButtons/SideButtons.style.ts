import styled, { css } from 'styled-components';

import playerIcon from 'assets/person.svg';
import cogIcon from 'assets/cog.svg';
import refreshIcon from 'assets/refresh.svg';

export const SideButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 32px;
  top: 32px;
  z-index: 120;
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

export const RefreshButton = styled.img.attrs({ src: refreshIcon })<{ isLoading: boolean }>`
  cursor: pointer;
  ${props =>
    props.isLoading &&
    css`
      @keyframes spin {
        100% {
          transform: rotate(-360deg);
        }
      }
      animation: spin 1s linear infinite;
    `}
`;

RefreshButton.displayName = 'RefreshButton';
