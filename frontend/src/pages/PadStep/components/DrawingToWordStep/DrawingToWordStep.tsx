import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Spacer from 'atoms/Spacer';
import InputLoader from 'atoms/InputLoader';
import TextInput from 'atoms/TextInput';
import {
  Gutter,
  LeftAndRightSide,
  LeftSide,
  RightSide,
  StyledHeader,
} from 'pages/PadStep/components/WordToDrawingStep/WordToDrawingStep.style';
import { PadStep } from 'redux/Game/types';
import RemainingPlayers from 'components/RemainingPlayers';
import Drawing from 'components/Canvas/Drawing';
import { useBoolean } from 'services/utils';
import { StyledButton, StyledForm } from './DrawingToWordStep.style';

interface Props {
  padStep: PadStep;
  saveStep: (sentence: string | null) => void;
  loading: boolean;
}

const DrawingToWordStep: React.FC<Props> = ({ padStep, saveStep, loading }) => {
  const [sentence, setSentence] = useState<string>(padStep.sentence || '');
  const [isEditing, activateEditing, deactivateEditing] = useBoolean(!padStep.sentence);
  const intl = useIntl();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (sentence !== '') {
      saveStep(sentence);
      deactivateEditing();
    }
  };

  const onClickUpdate = () => {
    activateEditing();
    saveStep(null);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <LeftAndRightSide>
      <LeftSide>
        <Drawing src={padStep.drawing_url} />
      </LeftSide>
      <Gutter />
      <RightSide>
        <StyledHeader>
          <FormattedMessage id="drawingToWord.drawingToGuess" />
        </StyledHeader>
        <StyledForm onSubmit={onSubmit}>
          <TextInput
            autoFocus={isEditing}
            readOnly={!isEditing}
            type="text"
            ref={inputRef}
            data-test="sentence-input"
            placeholder={intl.formatMessage({ id: 'padInit.placeholder' })}
            maxLength={100}
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            adornment={loading && <InputLoader />}
          />
          {isEditing ? (
            <StyledButton type="submit" disabled={loading}>
              <FormattedMessage id="drawingToWord.submit" />
            </StyledButton>
          ) : (
            <StyledButton
              type="button"
              data-test="update-sentence"
              onClick={onClickUpdate}
              disabled={loading}
            >
              <FormattedMessage id="drawingToWord.update" />
            </StyledButton>
          )}
        </StyledForm>

        <Spacer />
        <RemainingPlayers />
      </RightSide>
    </LeftAndRightSide>
  );
};

export default DrawingToWordStep;
