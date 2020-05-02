import BrushColorPicker from 'components/BrushColorPicker';
import { DrawingColor } from 'components/BrushColorPicker/BrushColorPicker';
import BrushTypePicker from 'components/BrushTypePicker';
import { BrushType } from 'components/BrushTypePicker/BrushTypePicker';
import CanvasActions from 'components/Canvas/CanvasActions';
import lzString from 'lz-string';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CanvasWrapper } from '../CanvasCommon.style';
import { drawLine, drawPaint, fillContext, Line, Paint, Point } from '../utils';
import { PadStepDone, StyledTimerIcon, WhiteHeader } from './CanvasDraw.style';

interface Props {
  finished: boolean;
  canvasWidth: number;
  canvasHeight: number;
  round_duration: number;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
}

const getBrushAttributes = (
  color: DrawingColor,
  brushType: BrushType,
): [DrawingColor, number, boolean] => {
  if ([BrushType.THICK_ERASER, BrushType.THIN_ERASER].includes(brushType)) {
    return ['#FFFFFF' as DrawingColor, brushType === BrushType.THICK_ERASER ? 10 : 2, false];
  }

  return [color, brushType === BrushType.THICK ? 6 : 2, brushType === BrushType.FILL];
};

const CanvasDraw: React.FC<Props> = ({
  canvasWidth,
  canvasHeight,
  finished,
  saveStep,
  round_duration,
}) => {
  const [color, setColor] = useState<DrawingColor>(DrawingColor.BLACK);
  const [brushType, setBrushType] = useState<BrushType>(BrushType.THIN);
  const [isPainting, setIsPainting] = useState(false);
  const drawing = useRef<Paint>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [mousePosition, setMousePosition] = useState<Point | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBrushColor, selectedBrushThickness, isFillDrawSelected] = getBrushAttributes(
    color,
    brushType,
  );
  const [archivedPaint, setArchivedPaint] = useState<Paint | null>(null);

  const setBrushColor = (newColor: DrawingColor) => {
    setColor(newColor);
    if ([BrushType.THIN_ERASER, BrushType.THICK_ERASER].includes(brushType)) {
      setBrushType(BrushType.THIN);
    }
  };

  const getCoordinates = (event: MouseEvent): Point | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.pageX - rect.left - window.scrollX,
      y: event.pageY - rect.top - window.scrollY,
    };
  };

  const startPaint = useCallback(
    (event: MouseEvent) => {
      const coordinates = getCoordinates(event);
      if (coordinates) {
        if (isFillDrawSelected) {
          fillContext(coordinates, canvasRef, selectedBrushColor);
          drawing.current = drawing.current.concat({
            point: coordinates,
            color: selectedBrushColor,
            type: 'fill',
          });
          return;
        }

        setIsPainting(true);
        setMousePosition(coordinates);
        drawLine(coordinates, coordinates, selectedBrushColor, selectedBrushThickness, canvasRef);
        setCurrentLine({
          points: [coordinates],
          color: selectedBrushColor,
          thickness: selectedBrushThickness,
          type: 'line',
        });
      }
    },
    [selectedBrushColor, selectedBrushThickness, isFillDrawSelected],
  );

  const paint = useCallback(
    (event: MouseEvent) => {
      if (isPainting) {
        const newPosition = getCoordinates(event);
        if (mousePosition && newPosition) {
          drawLine(
            mousePosition,
            newPosition,
            selectedBrushColor,
            selectedBrushThickness,
            canvasRef,
          );
          setMousePosition(newPosition);
          if (currentLine) {
            setCurrentLine({
              ...currentLine,
              points: currentLine.points.concat(newPosition),
            });
          }
        }
      }
    },
    [isPainting, mousePosition, selectedBrushColor, selectedBrushThickness, currentLine],
  );

  const exitPaint = useCallback(() => {
    if (isPainting) {
      setIsPainting(false);
      setMousePosition(undefined);
      if (currentLine) {
        drawing.current = drawing.current.concat(currentLine);
      }
      setCurrentLine(null);
    }
  }, [currentLine, isPainting]);

  const handleClearAndArchive = () => {
    setArchivedPaint(drawing.current);
    handleClear();
  };

  const handleClear = () => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawing.current = [];
    }
  };

  const handleUndo = () => {
    if (drawing.current.length === 0 && archivedPaint) {
      drawing.current = archivedPaint;
      drawPaint(archivedPaint, canvasRef);
      setArchivedPaint(null);
      return;
    }

    const paintToRedraw = drawing.current.slice(0, -1);
    handleClear();
    drawing.current = paintToRedraw;
    drawPaint(paintToRedraw, canvasRef);
  };

  const saveDrawing = useCallback(
    (drawing: string) => {
      if (saveStep) {
        saveStep({ drawing });
      }
    },
    [saveStep],
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousedown', startPaint);
    return () => {
      canvas.removeEventListener('mousedown', startPaint);
    };
  }, [startPaint]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousemove', paint);
    return () => {
      canvas.removeEventListener('mousemove', paint);
    };
  }, [paint]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);
    return () => {
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);
    };
  }, [exitPaint]);

  useEffect(() => {
    if (!round_duration || finished) return;
    const timeout = setTimeout(() => {
      const saveData = JSON.stringify({
        lines: drawing.current, // keep lines as key to be able to read previous drawings
        width: canvasWidth,
        height: canvasHeight,
      });
      const compressed = lzString.compressToBase64(saveData);
      saveDrawing(compressed);
    }, round_duration * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [canvasWidth, canvasHeight, saveDrawing, round_duration, finished]);

  return (
    <CanvasWrapper height={canvasHeight} width={canvasWidth}>
      <canvas ref={canvasRef} height={canvasHeight - 4} width={canvasWidth - 4} />
      {finished ? (
        <PadStepDone>
          <StyledTimerIcon />
          <WhiteHeader>
            <FormattedMessage id="wordToDrawing.timesUp" />
          </WhiteHeader>
        </PadStepDone>
      ) : (
        <>
          <CanvasActions onClear={handleClearAndArchive} onUndo={handleUndo} />
          <BrushTypePicker brushType={brushType} setBrushType={setBrushType} />
          <BrushColorPicker color={color} setColor={setBrushColor} />
        </>
      )}
    </CanvasWrapper>
  );
};

export default CanvasDraw;
