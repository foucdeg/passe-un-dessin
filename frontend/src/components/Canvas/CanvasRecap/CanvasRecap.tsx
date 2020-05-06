import React, { useEffect, useRef } from 'react';
import { Canvas } from '../CanvasCommon.style';
import { drawPaint, Paint } from '../utils';
import { FormattedMessage } from 'react-intl';

interface Props {
  width: number;
  height: number;
  saveData: string;
  hideBorder?: boolean;
}

type ParsedData = { lines: Paint; width: number; height: number };

const CanvasRecap: React.FC<Props> = ({ width, height, saveData, hideBorder }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parsedData: ParsedData | null = saveData && JSON.parse(saveData);

  useEffect(() => {
    if (parsedData) {
      drawPaint(parsedData.lines, canvasRef);
    }
  }, [parsedData]);

  if (!parsedData)
    return (
      <div style={{ width, height }}>
        <FormattedMessage id="drawingToWord.noDrawing" />
      </div>
    );

  return (
    <Canvas
      ref={canvasRef}
      height={parsedData.height}
      width={parsedData.width}
      containerHeight={height}
      containerWidth={width}
      hideBorder={hideBorder}
    />
  );
};

export default CanvasRecap;
