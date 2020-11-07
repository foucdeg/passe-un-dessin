import React from 'react';

import { CanvasActionsContainer, UndoAction, ClearAction, RedoAction } from './CanvasActions.style';

interface Props {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

const CanvasActions: React.FC<Props> = ({ onUndo, onClear, onRedo }) => (
  <CanvasActionsContainer>
    <UndoAction onClick={onUndo} />
    <RedoAction onClick={onRedo} />
    <ClearAction onClick={onClear} />
  </CanvasActionsContainer>
);

export default CanvasActions;
