/* eslint-disable max-lines */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import lzString from 'lz-string';
import { FormattedMessage } from 'react-intl';

import BrushColorPicker from 'components/Canvas/BrushColorPicker';
import { DrawingColor } from 'components/Canvas/BrushColorPicker/BrushColorPicker';
import BrushTypePicker from 'components/Canvas/BrushTypePicker';
import { BrushType } from 'components/Canvas/BrushTypePicker/BrushTypePicker';
import CanvasActions from 'components/Canvas/CanvasActions';
import {
  undoAndRedoHandlerBuilder,
  deleteHandlerBuilder,
  upAndDownHandlerBuilder,
  enterHandlerBuilder,
} from 'services/utils';
import {
  drawLine,
  drawPaint,
  fillContext,
  Line,
  Step,
  Paint,
  Point,
  resetCanvas,
  initializeCanvas,
} from '../utils';
import {
  Canvas,
  CanvasContainer,
  CanvasButtons,
  PadStepDone,
  RightButtons,
  StyledTimerIcon,
  WhiteHeader,
  StyledCheckIcon,
  CanvasAndSaveContainer,
} from './CanvasDraw.style';
import { getBrushAttributes } from './utils';

interface Props {
  finished?: boolean;
  canvasWidth: number;
  canvasHeight: number;
  roundDuration?: number;
  saveStep: (values: { drawing: string }) => void;
  displaySaveButton?: boolean;
  initialDrawing?: string | null;
}

const DRAWING_COLOR_VALUES = Object.values(DrawingColor);

const CanvasDraw: React.FC<Props> = ({
  canvasWidth,
  canvasHeight,
  finished,
  saveStep,
  roundDuration,
  displaySaveButton,
  initialDrawing,
}) => {
  const [color, setColor] = useState<DrawingColor>(DrawingColor.BLACK);
  const [brushType, setBrushType] = useState<BrushType>(BrushType.THIN);
  const isPaintingRef = useRef<boolean>(false);
  const drawing = useRef<Paint>([]);
  const undoneDrawing = useRef<Paint>([]);
  const mousePosition = useRef<Point | null>(null);
  const currentLine = useRef<Line | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<ImageData | null>(null);

  const [
    selectedBrushColor,
    selectedBrushRadius,
    isFillDrawSelected,
    pointCursor,
  ] = getBrushAttributes(color, brushType);
  const currentColorIndex = DRAWING_COLOR_VALUES.indexOf(selectedBrushColor);
  const cursorPosition =
    brushType === BrushType.FILL ? 17 : Math.round(selectedBrushRadius * Math.sqrt(2));
  const decodedDrawing = initialDrawing && lzString.decompressFromBase64(initialDrawing);

  const setBrushColor = useCallback(
    (newColor: DrawingColor) => {
      setColor(newColor);
      if ([BrushType.THIN_ERASER, BrushType.THICK_ERASER].includes(brushType)) {
        setBrushType(BrushType.THIN);
      }
    },
    [brushType],
  );

  const getCoordinates = (event: MouseEvent | TouchEvent): Point | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if ('changedTouches' in event) {
      return {
        x: event.changedTouches[0].pageX - rect.left - window.scrollX,
        y: event.changedTouches[0].pageY - rect.top - window.scrollY,
      };
    }

    // We round cordinates to avoid float when drawing on canvas, see: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#avoid_floating-point_coordinates_and_use_integers_instead
    return {
      x: Math.round(event.pageX - rect.left - window.scrollX),
      y: Math.round(event.pageY - rect.top - window.scrollY),
    };
  };

  const addToDrawing = (step: Step, resetUndoneDrawing = true) => {
    drawing.current.push(step);
    if (resetUndoneDrawing) {
      undoneDrawing.current = [];
    }
  };

  const selectPreviousColor = useCallback(() => {
    const previousColor = DRAWING_COLOR_VALUES[currentColorIndex - 1];
    if (previousColor) {
      setBrushColor(previousColor);
    }
  }, [setBrushColor, currentColorIndex]);

  const selectNextColor = useCallback(() => {
    const nextColor = DRAWING_COLOR_VALUES[currentColorIndex + 1];
    if (nextColor) {
      setBrushColor(nextColor);
    }
  }, [setBrushColor, currentColorIndex]);

  const startPaint = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const coordinates = getCoordinates(event);
      if (coordinates) {
        if (isFillDrawSelected) {
          fillContext(coordinates, canvasRef, imageRef, selectedBrushColor);
          addToDrawing({
            point: coordinates,
            color: selectedBrushColor,
            type: 'fill',
          });
          return;
        }

        isPaintingRef.current = true;
        mousePosition.current = coordinates;
        drawLine(
          coordinates,
          coordinates,
          selectedBrushColor,
          selectedBrushRadius,
          canvasRef,
          imageRef,
        );
        currentLine.current = {
          points: [coordinates],
          brushColor: selectedBrushColor,
          brushRadius: selectedBrushRadius,
          type: 'line',
        };
      }
    },
    [selectedBrushColor, selectedBrushRadius, isFillDrawSelected],
  );

  const paint = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (isPaintingRef.current && currentLine.current && mousePosition.current) {
        event.preventDefault();
        const newPosition = getCoordinates(event);
        if (mousePosition && newPosition) {
          drawLine(
            mousePosition.current,
            newPosition,
            selectedBrushColor,
            selectedBrushRadius,
            canvasRef,
            imageRef,
          );
          mousePosition.current = newPosition;
          currentLine.current.points.push(newPosition);
        }
      }
    },
    [selectedBrushColor, selectedBrushRadius],
  );

  const exitPaint = useCallback(() => {
    if (isPaintingRef.current) {
      isPaintingRef.current = false;
      mousePosition.current = null;
      if (currentLine.current) {
        addToDrawing(currentLine.current);
      }
      currentLine.current = null;
    }
  }, [currentLine]);

  const handleClear = useCallback(() => {
    const lastDrawingStep = drawing.current[drawing.current.length - 1];
    if (lastDrawingStep && lastDrawingStep.type === 'clear') {
      return;
    }
    // Do not use clearRect because a cleared canvas is black transparent
    resetCanvas(canvasRef, imageRef);
    addToDrawing({ type: 'clear' });
  }, []);

  const handleUndo = useCallback(() => {
    const removedStep = drawing.current.pop();
    if (removedStep) {
      undoneDrawing.current.push(removedStep);
      drawPaint(drawing.current, canvasRef, imageRef, true, decodedDrawing);
    }
  }, [decodedDrawing]);

  const handleRedo = useCallback(() => {
    const stepToRedraw = undoneDrawing.current.pop();
    if (stepToRedraw) {
      drawPaint([stepToRedraw], canvasRef, imageRef);
      addToDrawing(stepToRedraw, false);
    }
  }, []);

  const saveDrawing = useCallback(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;

    const saveData = canvas.toDataURL('image/png');
    const compressed = lzString.compressToBase64(saveData);

    saveStep({ drawing: compressed });
  }, [saveStep]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      undoAndRedoHandlerBuilder(handleUndo, handleRedo)(event);
      deleteHandlerBuilder(handleClear)(event);
      upAndDownHandlerBuilder(selectPreviousColor, selectNextColor)(event);
      if (displaySaveButton) {
        enterHandlerBuilder(saveDrawing)(event);
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [
    handleUndo,
    handleRedo,
    handleClear,
    selectPreviousColor,
    selectNextColor,
    saveDrawing,
    displaySaveButton,
  ]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('touchstart', startPaint);
    return () => {
      canvas.removeEventListener('mousedown', startPaint);
      canvas.removeEventListener('touchstart', startPaint);
    };
  }, [startPaint]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('touchmove', paint);
    return () => {
      canvas.removeEventListener('mousemove', paint);
      canvas.removeEventListener('touchmove', paint);
    };
  }, [paint]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);
    canvas.addEventListener('touchend', exitPaint);
    canvas.addEventListener('touchcancel', exitPaint);
    return () => {
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);
      canvas.removeEventListener('touchend', exitPaint);
      canvas.removeEventListener('touchcancel', exitPaint);
    };
  }, [exitPaint]);

  useEffect(() => {
    if (!roundDuration || finished) return;

    const timeout = setTimeout(() => {
      saveDrawing();
    }, roundDuration * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [canvasWidth, canvasHeight, saveDrawing, roundDuration, finished]);

  useEffect(() => {
    resetCanvas(canvasRef, imageRef);
    initializeCanvas(canvasRef, imageRef, decodedDrawing);
  }, [initialDrawing, decodedDrawing]);

  return (
    <CanvasContainer>
      <CanvasAndSaveContainer>
        <Canvas
          pointCursor={pointCursor}
          cursorPosition={cursorPosition}
          ref={canvasRef}
          height={canvasHeight}
          width={canvasWidth}
        />
        {displaySaveButton && <StyledCheckIcon onClick={saveDrawing} />}
      </CanvasAndSaveContainer>
      {finished ? (
        <PadStepDone>
          <StyledTimerIcon />
          <WhiteHeader>
            <FormattedMessage id="wordToDrawing.timesUp" />
          </WhiteHeader>
        </PadStepDone>
      ) : (
        <CanvasButtons>
          <BrushColorPicker color={color} setColor={setBrushColor} />
          <RightButtons>
            <CanvasActions onClear={handleClear} onUndo={handleUndo} onRedo={handleRedo} />
            <BrushTypePicker brushType={brushType} setBrushType={setBrushType} />
          </RightButtons>
        </CanvasButtons>
      )}
    </CanvasContainer>
  );
};

export default CanvasDraw;
