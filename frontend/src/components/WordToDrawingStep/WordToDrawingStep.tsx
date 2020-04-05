import React, { useRef, useCallback, useEffect, useState } from 'react';
import { PadStep } from 'redux/Game/types';
import CanvasDraw from 'react-canvas-draw';
import lzString from 'lz-string';
import BrushPicker from 'components/BrushPicker';
import { DrawingColor } from 'components/BrushPicker/BrushPicker';
import { Player } from 'redux/Player/types';
import TimerBar from 'components/TimerBar';

const ROUND_DURATION = 60; // seconds

interface Props {
  padStep: PadStep;
  previousPlayer: Player | null;
  nextPlayer: Player | null;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
}

const thickness = 2;
const eraserThickness = 10;

const WordToDrawingStep: React.FC<Props> = ({ padStep, previousPlayer, nextPlayer, saveStep }) => {
  const [color, setColor] = useState<DrawingColor>(DrawingColor.BLACK);

  const drawingPadRef = useRef<CanvasDraw>(null);
  const saveDrawing = useCallback(
    (drawing: string) => {
      saveStep({ drawing });
    },
    [saveStep],
  );

  useEffect(() => {
    if (!drawingPadRef.current) return;
    const drawingPad = drawingPadRef.current;

    const timeout = setTimeout(() => {
      const saveData = drawingPad.getSaveData();
      const compressed = lzString.compressToBase64(saveData);
      saveDrawing(compressed);
    }, ROUND_DURATION * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [saveDrawing, drawingPadRef]);

  if (!previousPlayer) return null;

  return (
    <>
      <TimerBar duration={60} />
      <p>
        Phrase à dessiner : <strong>{padStep.sentence}</strong> (sortie du cerveau malade de{' '}
        {previousPlayer.name})
      </p>
      <p>Tu as {ROUND_DURATION} secondes !</p>
      <CanvasDraw
        ref={drawingPadRef}
        brushColor={color}
        lazyRadius={0}
        canvasWidth={800}
        canvasHeight={600}
        brushRadius={color === DrawingColor.WHITE ? eraserThickness : thickness}
      />
      <BrushPicker color={color} setColor={setColor} />
      {nextPlayer && <p>Ça tombe bien, il paraît que {nextPlayer.name} aime l'art moderne.</p>}
    </>
  );
};

export default WordToDrawingStep;
