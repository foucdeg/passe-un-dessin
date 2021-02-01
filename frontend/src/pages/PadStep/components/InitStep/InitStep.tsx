import React, { useState } from 'react';
import Spacer from 'atoms/Spacer';
import { FormattedMessage, useIntl } from 'react-intl';
import { PadStep } from 'redux/Game/types';
import RemainingPlayers from 'components/RemainingPlayers';
import { useBoolean } from 'services/utils';
import InputLoader from 'atoms/InputLoader';
import InputArrow from 'atoms/InputArrow';
import SuggestionGenerator from '../SuggestionGenerator';
import {
  InitStepContainer,
  StyledForm,
  StyledTextInput,
  StyledButton,
  StyledHeader,
} from './InitStep.style';

interface Props {
  padStep: PadStep;
  saveStep: (values: { sentence?: string | null; drawing?: string }) => void;
  loading: boolean;
  drawOwnWord: boolean;
}

const InitStep: React.FC<Props> = ({ padStep, saveStep, loading, drawOwnWord }) => {
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
    <InitStepContainer>
      <StyledHeader>
        <FormattedMessage id="padInit.chooseSentence" />
      </StyledHeader>
      <StyledForm onSubmit={onSubmit}>
        {isInputDisabled && !loading ? (
          <>
            <StyledTextInput readOnly value={padStep.sentence || ''} />
            <StyledButton type="button" onClick={onClickUpdate}>
              <FormattedMessage id="padInit.update" />
            </StyledButton>
          </>
        ) : (
          <StyledTextInput
            autoFocus
            type="text"
            placeholder={intl.formatMessage({ id: 'padInit.placeholder' })}
            maxLength={100}
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            adornment={loading ? <InputLoader /> : <InputArrow alt="Valider" onClick={onSubmit} />}
          />
        )}
      </StyledForm>
      {drawOwnWord && (
        <p>
          <FormattedMessage
            id="padInit.youDraw"
            values={{ strong: (...chunks: string[]) => <strong>{chunks}</strong> }}
          />
        </p>
      )}
      <SuggestionGenerator onSuggestionClick={setSentence} />
      <Spacer />
      <RemainingPlayers />
    </InitStepContainer>
  );
};

export default InitStep;
