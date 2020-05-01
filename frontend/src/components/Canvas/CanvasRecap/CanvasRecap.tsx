import React, { useCallback, useEffect, useRef } from 'react';
import { CanvasWrapper } from '../CanvasCommon.style';
import { drawLines, Line } from '../utils';

interface Props {
  canvasWidth: number;
  canvasHeight: number;
  saveData: string;
  hideBorder?: boolean;
}

type ParsedData = { lines: Line[]; width: number; height: number };

const CanvasRecap: React.FC<Props> = ({ canvasWidth, canvasHeight, saveData, hideBorder }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doDrawLines = useCallback(drawLines, []);

  useEffect(() => {
    if (saveData) {
      const { lines, width, height }: ParsedData = JSON.parse(saveData);
      const scaleX = canvasWidth / width;
      const scaleY = canvasHeight / height;
      const scaleAvg = (scaleX + scaleY) / 2;

      const scaledLines = lines.map(line => ({
        points: line.points.map(point => ({ x: point.x * scaleX, y: point.y * scaleY })),
        color: line.color,
        thickness: line.thickness * scaleAvg,
      }));

      doDrawLines(scaledLines, canvasRef);
    }
  }, [saveData, doDrawLines, canvasWidth, canvasHeight]);

  return (
    <CanvasWrapper height={canvasHeight} width={canvasWidth} hideBorder={hideBorder}>
      <canvas ref={canvasRef} height={canvasHeight - 4} width={canvasWidth - 4} />
    </CanvasWrapper>
  );
};

export default CanvasRecap;
