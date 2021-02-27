import styled from 'styled-components';
import Header2 from 'atoms/Header2';
import { ReactComponent as UndoIcon } from 'assets/undo.svg';
import { colorPalette } from 'stylesheet';
import Modal from 'components/Modal';
import HorizontalSeparator from 'atoms/HorizontalSeparator';
import CanvasDraw from 'components/Canvas/CanvasDraw';

export const StyledModal = styled(Modal)`
  margin-top: 80px;
`;

export const StyledHeader = styled(Header2)`
  color: ${colorPalette.purple};
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

export const StyledSeparator = styled(HorizontalSeparator)`
  margin-bottom: 16px;
`;

export const ScoreCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

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

export const StyledCanvasDraw = styled(CanvasDraw)`
  margin-right: 50px;
`;
