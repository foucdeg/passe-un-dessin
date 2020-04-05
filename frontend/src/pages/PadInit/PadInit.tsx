import React, { useState } from 'react';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import TextInput from 'components/TextInput';
import { useSavePad } from 'redux/Game/hooks';

const PadInit: React.FunctionComponent = () => {
  const { padId } = useParams();
  const game = useSelector((state: RootState) => state.game.game);
  const player = useSelector((state: RootState) => state.player.player);
  const [sentence, setSentence] = useState<string>('');
  const [, doSavePad] = useSavePad();

  const pad = game?.pads.find(pad => pad.uuid === padId);

  if (!game) return null;
  if (!pad) return null;
  if (!player) return null;

  const nextPlayer = pad.steps[0].player;
  const isNextPlayerMe = nextPlayer.uuid === player.uuid;

  return (
    <>
      <p>Commence par choisir un mot ou une phrase : </p>
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
    </>
  );
};

export default PadInit;
