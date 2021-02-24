import styled, { css } from 'styled-components';

import userIcon from 'assets/person-filled.svg';
import playerIcon from 'assets/person.svg';
import cogIcon from 'assets/cog.svg';
import rankingIcon from 'assets/ranking.svg';
import refreshIcon from 'assets/refresh.svg';
import playerAddIcon from 'assets/person-add.svg';
import leaveIcon from 'assets/leave.svg';

export const SideButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 24px;
  top: 24px;
  z-index: 35;
  align-items: center;
`;

export const PlayerModalButton = styled.img.attrs({ src: playerIcon })`
  cursor: pointer;
  width: 24px;
  margin-bottom: 24px;
`;

export const UserModalButton = styled.img.attrs({ src: userIcon })`
  cursor: pointer;
  width: 24px;
  margin-bottom: 24px;
`;

export const AdminModalButton = styled.img.attrs({ src: cogIcon })`
  cursor: pointer;
  width: 24px;
  margin-bottom: 24px;
`;

export const PlayerAddButton = styled.img.attrs({ src: playerAddIcon })`
  cursor: pointer;
  width: 24px;
  margin-bottom: 24px;
`;

export const LeaveButton = styled.img.attrs({ src: leaveIcon })`
  cursor: pointer;
  width: 24px;
  margin-bottom: 24px;
`;

export const RankingModalButton = styled.img.attrs({ src: rankingIcon })`
  cursor: pointer;
  width: 24px;
  margin-bottom: 24px;
`;

export const RefreshButton = styled.img.attrs({ src: refreshIcon })<{ isLoading: boolean }>`
  cursor: pointer;
  width: 24px;
  margin-bottom: 24px;
  ${(props) =>
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
