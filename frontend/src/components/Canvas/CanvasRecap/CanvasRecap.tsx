import React, { useEffect, useRef } from 'react';
import { CanvasWrapper } from '../CanvasCommon.style';
import { drawPaint, Paint } from '../utils';

interface Props {
  canvasWidth: number;
  canvasHeight: number;
  saveData: string;
  hideBorder?: boolean;
}

type ParsedData = { lines: Paint; width: number; height: number };

const CanvasRecap: React.FC<Props> = ({ canvasWidth, canvasHeight, saveData, hideBorder }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (saveData) {
      const { lines: paint, width, height }: ParsedData = JSON.parse(saveData);
      const scaleX = canvasWidth / width;
      const scaleY = canvasHeight / height;
      const scaleAvg = (scaleX + scaleY) / 2;

      const scaledPaint = paint.map(paintStep => {
        switch (paintStep.type) {
          case 'line':
          case undefined: // To not break previous drawings
            return {
              ...paintStep,
              points: paintStep.points.map(point => ({ x: point.x * scaleX, y: point.y * scaleY })),
              brushRadius: paintStep.brushRadius * scaleAvg,
            };
          case 'fill':
            return {
              ...paintStep,
              point: { x: paintStep.point.x * scaleX, y: paintStep.point.y * scaleY },
            };
          default:
            return paintStep;
        }
      });

      drawPaint(scaledPaint, canvasRef);
    }
  }, [saveData, canvasWidth, canvasHeight]);

  return (
    <CanvasWrapper height={canvasHeight} width={canvasWidth} hideBorder={hideBorder}>
      <canvas ref={canvasRef} height={canvasHeight - 4} width={canvasWidth - 4} />
    </CanvasWrapper>
  );
};

export default CanvasRecap;
