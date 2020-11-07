import React from 'react';
import { useIntl } from 'react-intl';
import IconAndTooltip from 'atoms/IconAndTooltip';
import { getUndoCommand, getRedoCommand } from 'services/utils';

import { CanvasActionsContainer, UndoAction, ClearAction, RedoAction } from './CanvasActions.style';

interface Props {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

const CanvasActions: React.FC<Props> = ({ onUndo, onClear, onRedo }) => {
  const intl = useIntl();
  return (
    <CanvasActionsContainer>
      <IconAndTooltip
        tooltipText={intl.formatMessage({ id: `action.undo` }, { command: getUndoCommand() })}
        isRight
      >
        <UndoAction onClick={onUndo} />
      </IconAndTooltip>
      <IconAndTooltip
        tooltipText={intl.formatMessage({ id: `action.redo` }, { command: getRedoCommand() })}
        isRight
      >
        <RedoAction onClick={onRedo} />
      </IconAndTooltip>
      <IconAndTooltip tooltipText={intl.formatMessage({ id: `action.clear` })} isRight>
        <ClearAction onClick={onClear} />
      </IconAndTooltip>
    </CanvasActionsContainer>
  );
};

export default CanvasActions;
