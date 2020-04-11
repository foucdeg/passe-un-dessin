import styled, { css } from 'styled-components';
import { colorPalette } from 'stylesheet';
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

export const PadTab = styled.div<{ isActive: boolean }>`
  height: 40px;
  padding: 12px 24px;
  font-weight: bold;
  line-height: 19px;
  background: ${colorPalette.backgroundGrey};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  box-shadow: inset 7px 0 8px -7px rgba(0, 0, 0, 0.15);
  ${props =>
    props.isActive &&
    css`
      cursor: default;
      background: ${colorPalette.white};
      color: ${colorPalette.purple};
      box-shadow: none;
    `}
`;

PadTab.displayName = 'PadTab';

export const RestartButton = styled(SecondaryButton)`
  position: absolute;
  right: 0;
  top: -40px;
  height: 32px;
  padding: 0 16px;
`;

RestartButton.displayName = 'RestartButton';

export const ButtonRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 16px;
`;

ButtonRow.displayName = 'ButtonRow';

export const StyledHeader = styled(Header2)`
  margin-bottom: 16px;
`;
