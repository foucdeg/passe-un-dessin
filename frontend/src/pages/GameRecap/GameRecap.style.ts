import styled from 'styled-components';
import Header2 from 'atoms/Header2';

export const OuterRecapContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: scroll;
  width: 100%;
`;

OuterRecapContainer.displayName = 'OuterRecapContainer';

export const GameRecapContainer = styled.div`
  display: flex;
`;

GameRecapContainer.displayName = 'GameRecapContainer';

export const InnerDoneModal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

InnerDoneModal.displayName = 'InnerDoneModal';

export const PadTabsRow = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  top: -40px;
  left: 0;
`;

PadTabsRow.displayName = 'PadTabsRow';

export const StyledHeader = styled(Header2)`
  margin-bottom: 16px;
`;

StyledHeader.displayName = 'StyledHeader';
