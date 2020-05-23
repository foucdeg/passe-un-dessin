import React, { useState } from 'react';
import lzString from 'lz-string';
import { FormattedMessage, useIntl } from 'react-intl';

import Spacer from 'atoms/Spacer';
import InputLoader from 'components/InputLoader';
import { InputArrow } from 'components/PlayerModal/PlayerModal.style';
import StaticInput from 'components/StaticInput';
import TextInput from 'components/TextInput';
import {
  Gutter,
  LeftAndRightSide,
  LeftSide,
  RightSide,
  StyledHeader,
} from 'components/WordToDrawingStep/WordToDrawingStep.style';
import { PadStep } from 'redux/Game/types';
import { StyledButton, StyledForm } from './DrawingToWordStep.style';
import RemainingPlayers from 'components/RemainingPlayers';
import Drawing from 'components/Canvas/Drawing';

interface Props {
  padStep: PadStep;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
  loading: boolean;
}

const DrawingToWordStep: React.FC<Props> = ({ padStep, saveStep, loading }) => {
  const [sentence, setSentence] = useState<string>(padStep.sentence || '');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(!!padStep.sentence);
  const intl = useIntl();

  const onSubmit = (event: React.MouseEvent | React.FormEvent) => {
    event.preventDefault();
    if (sentence !== '') {
      saveStep({ sentence });
      setIsInputDisabled(true);
    }
  };

  const decodedSaveData = padStep.drawing && lzString.decompressFromBase64(padStep.drawing);

  return (
    <LeftAndRightSide>
      <LeftSide>
        <Drawing data={decodedSaveData} />
      </LeftSide>
      <Gutter />
      <RightSide>
        <StyledHeader>
          <FormattedMessage id="drawingToWord.drawingToGuess" />
        </StyledHeader>
        {isInputDisabled && !loading ? (
          <>
            <StaticInput>{padStep.sentence}</StaticInput>
            <StyledButton type="button" onClick={() => setIsInputDisabled(false)}>
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
              onChange={e => setSentence(e.target.value)}
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
