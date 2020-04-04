import React, { useState } from 'react';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import TextInput from 'components/TextInput';
import { useSavePad } from 'redux/Game/hooks';

const PadInit: React.FunctionComponent = () => {
  const { padId } = useParams();
  const game = useSelector((state: RootState) => state.game.game);
  const [sentence, setSentence] = useState<string>('');
  const [, doSavePad] = useSavePad();

  const pad = game?.pads.find(pad => pad.uuid === padId);

  if (!game) return null;
  if (!pad) return null;

  return (
    <>
      <p>Etape d'initialisation. Choisis un mot ou une phrase : </p>
      {pad.sentence ? (
        <p>{pad.sentence}</p>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            doSavePad(pad, sentence);
          }}
        >
          <TextInput type="text" value={sentence} onChange={e => setSentence(e.target.value)} />
        </form>
      )}
    </>
  );
};

export default PadInit;
