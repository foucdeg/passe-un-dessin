import React, { useRef, useCallback, useEffect, useState } from 'react';
import { PadStep } from 'redux/Game/types';
import CanvasDraw from 'react-canvas-draw';
import lzString from 'lz-string';
import BrushPicker from 'components/BrushPicker';
import { DrawingColor } from 'components/BrushPicker/BrushPicker';
import { Player } from 'redux/Player/types';
import TimerBar from 'components/TimerBar';
import {
  LeftSide,
  RightSide,
  CanvasWrapper,
  StyledHeader,
  Spacer,
  Sentence,
} from './WordToDrawingStep.style';

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
      <LeftSide>
        <CanvasWrapper>
          <CanvasDraw
            ref={drawingPadRef}
            brushColor={color}
            hideGrid={true}
            lazyRadius={0}
            canvasWidth={538}
            canvasHeight={538}
            brushRadius={color === DrawingColor.WHITE ? eraserThickness : thickness}
          />
          <BrushPicker color={color} setColor={setColor} />
        </CanvasWrapper>
      </LeftSide>
      <RightSide>
        <StyledHeader>Phrase à dessiner :</StyledHeader>
        <Sentence>{padStep.sentence}</Sentence>
        <em>(sortie du cerveau malade de {previousPlayer.name})</em>
        <Spacer />
        <p>Tu as {ROUND_DURATION} secondes !</p>
        <TimerBar duration={60} />
        {nextPlayer && <p>Ça tombe bien, il paraît que {nextPlayer.name} aime l'art moderne.</p>}
      </RightSide>
    </>
  );
};

export default WordToDrawingStep;
