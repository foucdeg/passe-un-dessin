import React, { useState } from 'react';
import { useSelector } from 'redux/useSelector';
import { useParams } from 'react-router';

import { useSavePad, useGetSuggestions } from 'redux/Game/hooks';
import {
  StyledHeader,
  PadInitContainer,
  StyledTextInput,
  StyledForm,
  InputArrow,
  SuggestionChip,
} from './PadInit.style';
import PlayerChip from 'atoms/PlayerChip';
import { StyledPlayerChips } from 'components/DrawingToWordStep/DrawingToWordStep.style';

import StaticInput from 'atoms/StaticInput';
import { selectGame, selectRemainingPlayers, selectSuggestions } from 'redux/Game/selectors';
import { selectPlayer } from 'redux/Player/selectors';
import { FormattedMessage, useIntl } from 'react-intl';
import { Spacer } from 'atoms/Spacer';

const PadInit: React.FunctionComponent = () => {
  const { padId } = useParams();
  const game = useSelector(selectGame);
  const suggestions = useSelector(selectSuggestions);

  const player = useSelector(selectPlayer);
  const remainingPlayers = useSelector(selectRemainingPlayers);
  const intl = useIntl();

  const [sentence, setSentence] = useState<string>('');
  const doSavePad = useSavePad();
  const doGetSuggestions = useGetSuggestions();

  const pad = game?.pads.find(pad => pad.uuid === padId);

  if (!game) return null;
  if (!pad) return null;
  if (!player) return null;

  const nextPlayer = pad.steps[0].player;
  const isNextPlayerMe = nextPlayer.uuid === player.uuid;

  return (
    <PadInitContainer>
      <StyledHeader>
        <FormattedMessage id="padInit.chooseSentence" />
      </StyledHeader>
      <StyledForm
        onSubmit={e => {
          e.preventDefault();
          if (sentence !== '') {
            doSavePad(pad, sentence);
          }
        }}
      >
        {pad.sentence ? (
          <StaticInput>{pad.sentence}</StaticInput>
        ) : (
          <StyledTextInput
            autoFocus
            type="text"
            placeholder={intl.formatMessage({ id: 'padInit.placeholder' })}
            value={sentence}
            onChange={e => setSentence(e.target.value)}
            adornment={<InputArrow alt="Valider" onClick={() => doSavePad(pad, sentence)} />}
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
      <button onClick={doGetSuggestions}>Pas inspiré ?</button>
      {suggestions.map(suggestion => (
        <SuggestionChip key={suggestion} onClick={() => setSentence(suggestion)}>
          {suggestion}
        </SuggestionChip>
      ))}
      <Spacer />
      <em>
        <FormattedMessage id="padInit.waitingFor" />
      </em>
      <StyledPlayerChips>
        {remainingPlayers.map(player => (
          <PlayerChip key={player.uuid} color={player.color}>
            {player.name}
          </PlayerChip>
        ))}
      </StyledPlayerChips>
    </PadInitContainer>
  );
};

export default PadInit;
