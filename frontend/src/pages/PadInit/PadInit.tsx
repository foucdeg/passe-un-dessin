import React, { useState } from 'react';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { useSavePad } from 'redux/Game/hooks';
import {
  StyledHeader,
  PadInitContainer,
  StyledTextInput,
  StyledForm,
  Spacer,
  InputArrow,
} from './PadInit.style';
import PlayerChip from 'atoms/PlayerChip';
import { StyledPlayerChips } from 'components/DrawingToWordStep/DrawingToWordStep.style';

import arrowRight from 'assets/arrow-right.svg';
import StaticInput from 'atoms/StaticInput';

const PadInit: React.FunctionComponent = () => {
  const { padId } = useParams();
  const game = useSelector((state: RootState) => state.game.game);
  const player = useSelector((state: RootState) => state.player.player);
  const remainingPlayers = useSelector((state: RootState) => state.game.remainingPlayers);

  const [sentence, setSentence] = useState<string>('');
  const [, doSavePad] = useSavePad();

  const pad = game?.pads.find(pad => pad.uuid === padId);

  if (!game) return null;
  if (!pad) return null;
  if (!player) return null;

  const nextPlayer = pad.steps[0].player;
  const isNextPlayerMe = nextPlayer.uuid === player.uuid;

  return (
    <PadInitContainer>
      <StyledHeader>Choisis un mot ou une phrase :</StyledHeader>
      {pad.sentence ? (
        <StaticInput>{pad.sentence}</StaticInput>
      ) : (
        <StyledForm
          onSubmit={e => {
            e.preventDefault();
            doSavePad(pad, sentence);
          }}
        >
          <StyledTextInput
            autoFocus
            type="text"
            placeholder="Une girafe ?"
            value={sentence}
            onChange={e => setSentence(e.target.value)}
            adornment={
              <InputArrow src={arrowRight} alt="Valider" onClick={() => doSavePad(pad, sentence)} />
            }
          />
        </StyledForm>
      )}
      {isNextPlayerMe ? (
        <p>
          Attention, c'est <strong>toi</strong> qui devras dessiner ça !
        </p>
      ) : (
        <p>
          Espérons que <strong>{nextPlayer.name}</strong> dessine bien ...
        </p>
      )}
      <Spacer />
      <em>On attend ceux-là pour continuer :</em>
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
