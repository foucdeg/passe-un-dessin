import React from 'react';

import { CanvasActionsContainer, UndoAction, ClearAction } from './CanvasActions.style';

interface Props {
  onUndo: () => void;
  onClear: () => void;
}

const CanvasActions: React.FC<Props> = ({ onUndo, onClear }) => (
  <CanvasActionsContainer>
    <UndoAction onClick={onUndo} />
    <ClearAction onClick={onClear} />
  </CanvasActionsContainer>
);

export default CanvasActions;
