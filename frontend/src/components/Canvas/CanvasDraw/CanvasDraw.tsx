import BrushColorPicker from 'components/BrushColorPicker';
import { DrawingColor } from 'components/BrushColorPicker/BrushColorPicker';
import BrushTypePicker from 'components/BrushTypePicker';
import { BrushType } from 'components/BrushTypePicker/BrushTypePicker';
import CanvasActions from 'components/Canvas/CanvasActions';
import lzString from 'lz-string';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CanvasWrapper } from '../CanvasCommon.style';
import { drawLine, drawLines, Line, Point } from '../utils';
import { PadStepDone, StyledTimerIcon, WhiteHeader } from './CanvasDraw.style';

interface Props {
  finished: boolean;
  canvasWidth: number;
  canvasHeight: number;
  round_duration: number;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
}

const getBrushAttributes = (color: DrawingColor, brushType: BrushType): [DrawingColor, number] => {
  if ([BrushType.THICK_ERASER, BrushType.THIN_ERASER].includes(brushType)) {
    return ['#FFFFFF' as DrawingColor, brushType === BrushType.THICK_ERASER ? 10 : 2];
  }

  return [color, brushType === BrushType.THICK ? 6 : 2];
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
  const lines = useRef<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [mousePosition, setMousePosition] = useState<Point | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBrushColor, selectedBrushThickness] = getBrushAttributes(color, brushType);

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

  const doDrawLines = useCallback(drawLines, []);
  const doDrawLine = useCallback(drawLine, []);

  const startPaint = useCallback(
    (event: MouseEvent) => {
      const coordinates = getCoordinates(event);
      if (coordinates) {
        setIsPainting(true);
        setMousePosition(coordinates);
        doDrawLine(coordinates, coordinates, selectedBrushColor, selectedBrushThickness, canvasRef);
        setCurrentLine({
          points: [coordinates],
          color: selectedBrushColor,
          thickness: selectedBrushThickness,
        });
      }
    },
    [selectedBrushColor, selectedBrushThickness, doDrawLine],
  );

  const paint = useCallback(
    (event: MouseEvent) => {
      if (isPainting) {
        const newPosition = getCoordinates(event);
        if (mousePosition && newPosition) {
          doDrawLine(
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
    [
      isPainting,
      mousePosition,
      selectedBrushColor,
      selectedBrushThickness,
      currentLine,
      doDrawLine,
    ],
  );

  const exitPaint = useCallback(() => {
    if (isPainting) {
      setIsPainting(false);
      setMousePosition(undefined);
      if (currentLine) {
        lines.current = lines.current.concat(currentLine);
      }
      setCurrentLine(null);
    }
  }, [currentLine, isPainting]);

  const handleClear = () => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      lines.current = [];
    }
  };

  const handleUndo = useCallback(() => {
    const linesToRedraw = lines.current.slice(0, -1);
    handleClear();
    lines.current = linesToRedraw;
    doDrawLines(linesToRedraw, canvasRef);
  }, [doDrawLines]);

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
        lines: lines.current,
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
          <CanvasActions onClear={handleClear} onUndo={handleUndo} />
          <BrushTypePicker brushType={brushType} setBrushType={setBrushType} />
          <BrushColorPicker color={color} setColor={setBrushColor} />
        </>
      )}
    </CanvasWrapper>
  );
};

export default CanvasDraw;
