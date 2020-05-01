export type Point = { x: number; y: number };
export type Line = { points: Point[]; color: string; thickness: number };

export const drawLine = (
  startPosition: Point,
  endPosition: Point,
  brushColor: string,
  brushThickness: number,
  canvasRef: {
    readonly current: HTMLCanvasElement | null;
  },
) => {
  if (!canvasRef.current) {
    return;
  }
  const canvas: HTMLCanvasElement = canvasRef.current;
  const context = canvas.getContext('2d');
  if (context) {
    context.strokeStyle = brushColor;
    context.fillStyle = brushColor;
    context.lineJoin = 'round';
    context.lineWidth = brushThickness;

    context.beginPath();

    if (startPosition.x === endPosition.x && startPosition.y === endPosition.y) {
      context.arc(startPosition.x, startPosition.y, brushThickness / 2, 0, Math.PI * 2);
      context.fill();
    } else {
      context.moveTo(startPosition.x, startPosition.y);
      context.lineTo(endPosition.x, endPosition.y);
      context.closePath();
      context.stroke();
    }
  }
};

export const drawLines = (
  lines: Line[],
  canvasRef: {
    readonly current: HTMLCanvasElement | null;
  },
) => {
  lines.forEach(line => {
    line.points.forEach((point, index) => {
      const nextPoint = line.points[index + 1] || point;
      drawLine(point, nextPoint, line.color, line.thickness, canvasRef);
    });
  });
};
