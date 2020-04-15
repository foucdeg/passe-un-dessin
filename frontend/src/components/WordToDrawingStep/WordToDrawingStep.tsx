import React, { useRef, useCallback, useEffect, useState } from 'react';
import { PadStep } from 'redux/Game/types';
import CanvasDraw from 'react-canvas-draw';
import lzString from 'lz-string';
import BrushColorPicker from 'components/BrushColorPicker';
import BrushTypePicker from 'components/BrushTypePicker';
import { DrawingColor } from 'components/BrushColorPicker/BrushColorPicker';
import { Player } from 'redux/Player/types';
import Timer from 'components/Timer';
import {
  LeftAndRightSide,
  LeftSide,
  RightSide,
  Gutter,
  CanvasWrapper,
  StyledHeader,
  Spacer,
  Sentence,
} from './WordToDrawingStep.style';
import { BrushType } from 'components/BrushTypePicker/BrushTypePicker';
import { FormattedMessage } from 'react-intl';

const ROUND_DURATION = 60; // seconds

interface Props {
  padStep: PadStep;
  previousPlayer: Player | null;
  nextPlayer: Player | null;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
}

const getBrushAttributes = (color: DrawingColor, brushType: BrushType): [DrawingColor, number] => {
  if ([BrushType.THICK_ERASER, BrushType.THIN_ERASER].includes(brushType)) {
    return ['#FFFFFF' as DrawingColor, brushType === BrushType.THICK_ERASER ? 10 : 2];
  }

  return [color, brushType === BrushType.THICK ? 6 : 2];
};

const WordToDrawingStep: React.FC<Props> = ({ padStep, previousPlayer, saveStep }) => {
  const [color, setColor] = useState<DrawingColor>(DrawingColor.BLACK);
  const [brushType, setBrushType] = useState<BrushType>(BrushType.THIN);

  const setBrushColor = (newColor: DrawingColor) => {
    setColor(newColor);
    setBrushType(BrushType.THIN);
  };

  const [brushColor, brushThickness] = getBrushAttributes(color, brushType);

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
    <LeftAndRightSide>
      <LeftSide>
        <CanvasWrapper>
          <CanvasDraw
            ref={drawingPadRef}
            brushColor={brushColor}
            hideGrid={true}
            lazyRadius={0}
            canvasWidth={538}
            canvasHeight={538}
            brushRadius={brushThickness}
          />
          <BrushTypePicker brushType={brushType} setBrushType={setBrushType} />
          <BrushColorPicker color={color} setColor={setBrushColor} />
        </CanvasWrapper>
      </LeftSide>
      <Gutter />
      <RightSide>
        <StyledHeader>
          <FormattedMessage id="wordToDrawing.sentenceToDraw" />
        </StyledHeader>
        <Sentence>{padStep.sentence}</Sentence>
        <em>
          <FormattedMessage
            id="wordToDrawing.previousPlayer"
            values={{ name: previousPlayer.name }}
          />
        </em>
        <Spacer />
        <p>
          <FormattedMessage id="wordToDrawing.duration" values={{ duration: ROUND_DURATION }} />
        </p>
        <Timer duration={ROUND_DURATION} />
      </RightSide>
    </LeftAndRightSide>
  );
};

export default WordToDrawingStep;
