import React, { useEffect, useRef } from 'react';
import { CanvasWrapper } from '../CanvasCommon.style';
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
    <CanvasWrapper
      canvasHeight={canvasHeight}
      canvasWidth={canvasWidth}
      containerHeight={height}
      containerWidth={width}
      hideBorder={hideBorder}
    >
      <canvas ref={canvasRef} height={canvasHeight - 4} width={canvasWidth - 4} />
    </CanvasWrapper>
  );
};

export default CanvasRecap;
