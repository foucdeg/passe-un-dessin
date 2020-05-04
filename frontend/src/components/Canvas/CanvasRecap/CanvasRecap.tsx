import React, { useEffect, useRef } from 'react';
import { Canvas } from '../CanvasCommon.style';
import { drawPaint, Paint } from '../utils';

interface Props {
  width: number;
  height: number;
  saveData: string;
  hideBorder?: boolean;
}

type ParsedData = { lines: Paint; width: number; height: number };

const CanvasRecap: React.FC<Props> = ({ width, height, saveData, hideBorder }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { lines: paint, width: canvasWidth, height: canvasHeight }: ParsedData = JSON.parse(
    saveData,
  );

  useEffect(() => {
    drawPaint(paint, canvasRef);
  }, [paint]);

  return (
    <Canvas
      ref={canvasRef}
      height={canvasHeight}
      width={canvasWidth}
      containerHeight={height}
      containerWidth={width}
      hideBorder={hideBorder}
    />
  );
};

export default CanvasRecap;
