import React, { useEffect, useRef, useState } from 'react';
import Spacer from 'atoms/Spacer';
import { FormattedMessage, useIntl } from 'react-intl';
import { PadStep } from 'redux/Game/types';
import RemainingPlayers from 'components/RemainingPlayers';
import { useBoolean } from 'services/utils';
import InputLoader from 'atoms/InputLoader';
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
  saveStep: (sentence: string | null) => void;
  loading: boolean;
  drawOwnWord: boolean;
}

const InitStep: React.FC<Props> = ({ padStep, saveStep, loading, drawOwnWord }) => {
  console.log('in InitStep', padStep.uuid);
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

  const onSuggestionClick = (suggestionText: string) => {
    setSentence(suggestionText);
    inputRef.current?.focus();
  };

  return (
    <InitStepContainer>
      <StyledHeader>
        <FormattedMessage id="padInit.chooseSentence" />
      </StyledHeader>
      <StyledForm onSubmit={onSubmit}>
        <StyledTextInput
          autoFocus={isEditing}
          readOnly={!isEditing || loading}
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
            <FormattedMessage id="padInit.submit" />
          </StyledButton>
        ) : (
          <StyledButton type="button" onClick={onClickUpdate} disabled={loading}>
            <FormattedMessage id="padInit.update" />
          </StyledButton>
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
      <SuggestionGenerator onSuggestionClick={onSuggestionClick} />
      <Spacer />
      <RemainingPlayers />
    </InitStepContainer>
  );
};

export default InitStep;
