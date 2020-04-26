import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { colorPalette, fontSize, fontFamily } from 'stylesheet';

export const OuterRecapContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 490px;
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

export const VoteReminder = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: ${colorPalette.purple};
  font-size: ${fontSize.header2};
  font-family: ${fontFamily.titles};
  text-transform: uppercase;
`;
