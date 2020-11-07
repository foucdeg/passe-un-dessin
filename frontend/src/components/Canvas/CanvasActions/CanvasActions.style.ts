import deleteIcon from 'assets/delete.svg';
import undoIcon from 'assets/undo.svg';
import redoIcon from 'assets/redo.svg';
import styled from 'styled-components';

export const CanvasActionsContainer = styled.div`
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
CanvasActionsContainer.displayName = 'CanvasActionsContainer';

const actionDefaultStyle = `
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export const UndoAction = styled.img.attrs({ src: undoIcon })`
  ${actionDefaultStyle}
`;

export const RedoAction = styled.img.attrs({ src: redoIcon })`
  ${actionDefaultStyle}
`;
RedoAction.displayName = 'RedoAction';

export const ClearAction = styled.img.attrs({ src: deleteIcon })`
  ${actionDefaultStyle}
`;
ClearAction.displayName = 'ClearAction';
