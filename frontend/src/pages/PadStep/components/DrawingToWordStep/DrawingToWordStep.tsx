import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Spacer from 'atoms/Spacer';
import InputLoader from 'atoms/InputLoader';
import { InputArrow } from 'modals/PlayerModal/components/PlayerForm/PlayerForm.style';
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
  saveStep: (values: { sentence?: string | null; drawing?: string }) => void;
  loading: boolean;
}

const DrawingToWordStep: React.FC<Props> = ({ padStep, saveStep, loading }) => {
  const [sentence, setSentence] = useState<string>(padStep.sentence || '');
  const [isInputDisabled, disableInput, reenableInput] = useBoolean(!!padStep.sentence);
  const intl = useIntl();

  const onSubmit = (event: React.MouseEvent | React.FormEvent) => {
    event.preventDefault();
    if (sentence !== '') {
      saveStep({ sentence });
      disableInput();
    }
  };

  const onClickUpdate = () => {
    reenableInput();
    saveStep({ sentence: null });
  };

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
        {isInputDisabled && !loading ? (
          <>
            <TextInput readOnly value={padStep.sentence || ''} />
            <StyledButton type="button" onClick={onClickUpdate}>
              <FormattedMessage id="drawingToWord.update" />
            </StyledButton>
          </>
        ) : (
          <StyledForm onSubmit={onSubmit}>
            <TextInput
              type="text"
              autoFocus
              placeholder={intl.formatMessage({ id: 'drawingToWord.placeholder' })}
              value={sentence}
              maxLength={100}
              onChange={(e) => setSentence(e.target.value)}
              adornment={
                loading ? <InputLoader /> : <InputArrow alt="Valider" onClick={onSubmit} />
              }
            />
            <StyledButton type="submit">
              <FormattedMessage id="drawingToWord.submit" />
            </StyledButton>
          </StyledForm>
        )}

        <Spacer />
        <RemainingPlayers />
      </RightSide>
    </LeftAndRightSide>
  );
};

export default DrawingToWordStep;
