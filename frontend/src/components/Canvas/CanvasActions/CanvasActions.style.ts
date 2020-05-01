import styled from 'styled-components';

import undoIcon from 'assets/undo.svg';
import deleteIcon from 'assets/delete.svg';

export const CanvasActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 25;
`;

CanvasActionsContainer.displayName = 'CanvasActionsContainer';

export const UndoAction = styled.img.attrs({ src: undoIcon })`
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-bottom: 16px;
`;

UndoAction.displayName = 'UndoAction';

export const ClearAction = styled.img.attrs({ src: deleteIcon })`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

ClearAction.displayName = 'ClearAction';
