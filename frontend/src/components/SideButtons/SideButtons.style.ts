import styled from 'styled-components';

export const SideButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 32px;
  top: 32px;
  z-index: 20;
`;

export const AdminModalButton = styled.img`
  cursor: pointer;
  margin-bottom: 24px;
`;

AdminModalButton.displayName = 'AdminModalButton';

export const RefreshButton = styled.img`
  cursor: pointer;
`;

RefreshButton.displayName = 'RefreshButton';
