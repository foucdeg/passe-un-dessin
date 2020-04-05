import React, { useState } from 'react';
import { PadStep } from 'redux/Game/types';
import CanvasDraw from 'react-canvas-draw';
import TextInput from 'components/TextInput';
import lzString from 'lz-string';

interface Props {
  padStep: PadStep;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
}

const DrawingToWordStep: React.FC<Props> = ({ padStep, saveStep }) => {
  const [sentence, setSentence] = useState<string>('');

  return (
    <>
      <CanvasDraw disabled hideGrid saveData={lzString.decompressFromBase64(padStep.drawing)} />
      <p>Ce message doit pourtant avoir un sens. Mais lequel ?</p>
      {padStep.sentence ? (
        <p>{padStep.sentence}</p>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            saveStep({ sentence });
          }}
        >
          <TextInput type="text" value={sentence} onChange={e => setSentence(e.target.value)} />
          <input type="submit" value="Valider" />
        </form>
      )}
    </>
  );
};

export default DrawingToWordStep;
