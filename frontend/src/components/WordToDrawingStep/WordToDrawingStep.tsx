import React, { useRef, useCallback, useEffect, useState } from 'react';
import { PadStep } from 'redux/Game/types';
import CanvasDraw from 'react-canvas-draw';
import lzString from 'lz-string';
import BrushPicker from 'components/BrushPicker';
import { DrawingColor } from 'components/BrushPicker/BrushPicker';

const ROUND_DURATION = 10; // seconds

interface Props {
  padStep: PadStep;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
}

const thickness = 4;
const eraserThickness = 20;

const WordToDrawingStep: React.FC<Props> = ({ padStep, saveStep }) => {
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

  return (
    <>
      <p>Phrase à dessiner : {padStep.sentence}</p>
      <p>Tu as {ROUND_DURATION} secondes !</p>
      <CanvasDraw
        ref={drawingPadRef}
        hideGrid
        brushColor={color}
        brushRadius={color === DrawingColor.WHITE ? eraserThickness : thickness}
      />
      <BrushPicker color={color} setColor={setColor} />
    </>
  );
};

export default WordToDrawingStep;
