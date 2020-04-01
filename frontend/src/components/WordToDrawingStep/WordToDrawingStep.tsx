import React, { useRef, useCallback, useEffect, useState } from 'react';
import { PadStep } from 'redux/Game/types';
import CanvasDraw from 'react-canvas-draw';
import lzString from 'lz-string';
import BrushPicker from 'components/BrushPicker';
import { DrawingColor } from 'components/BrushPicker/BrushPicker';

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

    const interval = setInterval(() => {
      const saveData = drawingPad.getSaveData();
      const compressed = lzString.compressToBase64(saveData);
      saveDrawing(compressed);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [saveDrawing, drawingPadRef]);

  // Disabled: glitches
  // useEffect(() => {
  //   if (!padStep.drawing) return;
  //   if (!drawingPadRef.current) return;

  //   console.log('about to load', padStep.drawing);
  //   drawingPadRef.current.loadSaveData(lzString.decompressFromBase64(padStep.drawing), true);
  // }, [padStep, drawingPadRef]);

  return (
    <>
      <p>Phrase à dessiner : {padStep.sentence}</p>
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
