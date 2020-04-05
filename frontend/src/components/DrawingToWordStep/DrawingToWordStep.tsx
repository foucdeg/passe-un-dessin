import React, { useState } from 'react';
import { PadStep } from 'redux/Game/types';
import CanvasDraw from 'react-canvas-draw';
import TextInput from 'components/TextInput';
import lzString from 'lz-string';
import { Player } from 'redux/Player/types';

interface Props {
  padStep: PadStep;
  previousPlayer: Player | null;
  nextPlayer: Player | null;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
}

const DrawingToWordStep: React.FC<Props> = ({ padStep, saveStep, previousPlayer, nextPlayer }) => {
  const [sentence, setSentence] = useState<string>('');

  if (!previousPlayer) return null;

  return (
    <>
      <CanvasDraw
        disabled
        hideGrid
        canvasWidth={800}
        canvasHeight={600}
        saveData={lzString.decompressFromBase64(padStep.drawing)}
      />
      <p>Ce message de {previousPlayer.name} doit pourtant avoir un sens. Mais lequel ?</p>
      {padStep.sentence ? (
        <>
          <p>{padStep.sentence}</p>
          {nextPlayer && (
            <p>
              En espérant que {nextPlayer.name} sache mieux dessiner que {previousPlayer.name} ...
            </p>
          )}
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            saveStep({ sentence });
          }}
        >
          <TextInput
            type="text"
            autoFocus
            value={sentence}
            onChange={e => setSentence(e.target.value)}
          />
          <input type="submit" value="Valider" />
        </form>
      )}
    </>
  );
};

export default DrawingToWordStep;
