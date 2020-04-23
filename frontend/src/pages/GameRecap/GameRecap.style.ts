import styled from 'styled-components';
import SecondaryButton from 'components/SecondaryButton';
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

export const TopRightButtons = styled.div`
  position: absolute;
  right: 0;
  top: -40px;
`;

TopRightButtons.displayName = 'TopRightButtons';

export const TopRightButton = styled(SecondaryButton)`
  height: 32px;
  padding: 0 16px;
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

TopRightButton.displayName = 'TopRightButton';

export const StyledHeader = styled(Header2)`
  margin-bottom: 16px;
`;

StyledHeader.displayName = 'StyledHeader';
