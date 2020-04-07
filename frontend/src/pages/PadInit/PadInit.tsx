import React, { useState } from 'react';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import TextInput from 'components/TextInput';
import { useSavePad } from 'redux/Game/hooks';
import Header2 from 'atoms/Header2';
import { PadInitContainer } from './PadInit.style';
import PlayerChips from 'atoms/PlayerChipList';
import PlayerChip from 'atoms/PlayerChip';

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
      <Header2>Choisis un mot ou une phrase :</Header2>
      {pad.sentence ? (
        <p>{pad.sentence}</p>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            doSavePad(pad, sentence);
          }}
        >
          <TextInput
            autoFocus
            type="text"
            placeholder="Une girafe ?"
            value={sentence}
            onChange={e => setSentence(e.target.value)}
          />
        </form>
      )}
      {isNextPlayerMe ? (
        <p>Attention, c'est toi qui devras dessiner ça !</p>
      ) : (
        <p>
          Espérons que <strong>{nextPlayer.name}</strong> dessine bien ...
        </p>
      )}
      <p>On attend encore:</p>
      <PlayerChips>
        {remainingPlayers.map(player => (
          <PlayerChip key={player.uuid} color={player.color}>
            {player.name}
          </PlayerChip>
        ))}
      </PlayerChips>
    </PadInitContainer>
  );
};

export default PadInit;
