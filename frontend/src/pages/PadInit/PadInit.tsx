import React, { useEffect, useState } from 'react';
import { useSelector } from 'redux/useSelector';
import { useParams } from 'react-router';

import { useSavePad } from 'redux/Game/hooks';

import { selectGame } from 'redux/Game/selectors';
import { selectPlayer } from 'redux/Player/selectors';
import { FormattedMessage, useIntl } from 'react-intl';
import Spacer from 'atoms/Spacer';
import InputLoader from 'atoms/InputLoader';
import RemainingPlayers from 'components/RemainingPlayers';
import { useBoolean } from 'services/utils';
import SuggestionGenerator from './components/SuggestionGenerator';
import {
  StyledHeader,
  PadInitContainer,
  StyledTextInput,
  StyledForm,
  InputArrow,
  StyledButton,
  StyledStaticInput,
} from './PadInit.style';

interface RouteParams {
  padId: string;
}

const PadInit: React.FunctionComponent = () => {
  const { padId } = useParams<RouteParams>();
  const game = useSelector(selectGame);

  const player = useSelector(selectPlayer);
  const intl = useIntl();

  const [sentence, setSentence] = useState<string>('');
  const [isInputDisabled, disableInput, reenableInput] = useBoolean(false);

  const [{ loading }, doSavePad] = useSavePad();

  useEffect(() => {
    if (!game) return;
    const pad = game.pads.find((pad) => pad.uuid === padId);
    if (!pad) return;

    if (pad.sentence) {
      disableInput();
    }
  }, [game, padId, disableInput]);

  if (!game) return null;

  const onClickUpdate = () => {
    reenableInput();
    doSavePad({ pad, sentence: null });
  };

  const pad = game.pads.find((pad) => pad.uuid === padId);
  if (!pad) return null;
  if (!pad.steps.length) return null;
  if (!player) return null;

  const nextPlayer = pad.steps[0].player;
  const isNextPlayerMe = nextPlayer.uuid === player.uuid;

  const onSubmit = (event: React.MouseEvent | React.FormEvent) => {
    event.preventDefault();
    if (sentence !== '' && !loading) {
      doSavePad({ pad, sentence });
      disableInput();
    }
  };

  return (
    <PadInitContainer>
      <StyledHeader>
        <FormattedMessage id="padInit.chooseSentence" />
      </StyledHeader>
      <StyledForm onSubmit={onSubmit}>
        {isInputDisabled && !loading ? (
          <>
            <StyledStaticInput>{pad.sentence}</StyledStaticInput>
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
      {isNextPlayerMe ? (
        <p>
          <FormattedMessage
            id="padInit.youDraw"
            values={{ strong: (...chunks: string[]) => <strong>{chunks}</strong> }}
          />
        </p>
      ) : (
        <p>
          <FormattedMessage
            id="padInit.nextPlayer"
            values={{
              strong: (...chunks: string[]) => <strong>{chunks}</strong>,
              name: nextPlayer.name,
            }}
          />
        </p>
      )}
      <SuggestionGenerator onSuggestionClick={setSentence} />
      <Spacer />
      <RemainingPlayers />
    </PadInitContainer>
  );
};

export default PadInit;
