import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { ReactComponent as UndoIcon } from 'assets/undo.svg';
import { colorPalette } from 'stylesheet';
import Modal from 'components/Modal';
import HorizontalSeparator from 'atoms/HorizontalSeparator';

export const WideModal = styled(Modal)`
  width: 768px;
  padding: 24px;
`;

WideModal.displayName = 'WideModal';

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
`;

StyledHeader.displayName = 'StyledHeader';

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

HeaderSection.displayName = 'HeaderSection';

export const StyledSeparator = styled(HorizontalSeparator)`
  margin-bottom: 16px;
`;
StyledSeparator.displayName = 'StyledSeparator';

export const ScoreCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

ScoreCardRow.displayName = 'ScoreCardRow';

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

ButtonRow.displayName = 'ButtonRow';

export const UndoAction = styled(UndoIcon)`
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: absolute;
  left: 20px;

  .main {
    fill: ${colorPalette.purple};
  }
`;
UndoAction.displayName = 'UndoAction';
