import deleteIcon from 'assets/delete.svg';
import undoIcon from 'assets/undo.svg';
import redoIcon from 'assets/redo.svg';
import styled from 'styled-components';

export const CanvasActionsContainer = styled.div`
  height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

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

export const ClearAction = styled.img.attrs({ src: deleteIcon })`
  ${actionDefaultStyle}
`;
