export type Point = { x: number; y: number };
export type Line = { points: Point[]; brushColor: string; brushRadius: number; type: 'line' };
export type Fill = { point: Point; color: string; type: 'fill' };
export type Paint = (Line | Fill)[];

type canvasRefType = {
  readonly current: HTMLCanvasElement | null;
};
type RGBAColor = {
  r: number;
  g: number;
  b: number;
};

export const resetCanvas = (canvasRef: canvasRefType) => {
  if (canvasRef.current) {
    const context = canvasRef.current.getContext('2d');
    if (context) {
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }
};

export const drawLine = (
  startPosition: Point,
  endPosition: Point,
  brushColor: string,
  brushRadius: number,
  canvasRef: canvasRefType,
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
    context.lineWidth = brushRadius * 2;

    context.beginPath();

    if (startPosition.x === endPosition.x && startPosition.y === endPosition.y) {
      context.arc(startPosition.x, startPosition.y, brushRadius, 0, Math.PI * 2);
      context.fill();
    } else {
      context.moveTo(startPosition.x, startPosition.y);
      context.lineTo(endPosition.x, endPosition.y);
      context.closePath();
      context.stroke();
    }
  }
};

export const drawPaint = (paint: Paint, canvasRef: canvasRefType) => {
  paint.forEach(paintStep => {
    switch (paintStep.type) {
      case 'line':
      case undefined: // To not break previous drawings
        paintStep.points.forEach((point, index) => {
          const nextPoint = paintStep.points[index + 1] || point;
          drawLine(point, nextPoint, paintStep.brushColor, paintStep.brushRadius, canvasRef);
        });
        break;
      case 'fill':
        fillContext(paintStep.point, canvasRef, paintStep.color);
        break;
      default:
        break;
    }
  });
};

const floodfill = (
  data: Uint8ClampedArray,
  x: number,
  y: number,
  fillcolor: RGBAColor,
  tolerance: number,
  width: number,
) => {
  const length = data.length;
  const queue = [];
  let pixel = (x + y * width) * 4;
  const dataWidth = width * 4;

  const targetColor = [data[pixel], data[pixel + 1], data[pixel + 2], data[pixel + 3]];

  if (arePixelEqual(targetColor, [fillcolor.r, fillcolor.g, fillcolor.b], tolerance)) {
    return;
  }

  queue.push(pixel);
  while (queue.length) {
    pixel = queue.pop() as number;
    if (setPixelIfNeeded(pixel, targetColor, fillcolor, data, length, tolerance)) {
      queue.push(pixel - 4);
      queue.push(pixel + 4);
      queue.push(pixel - dataWidth);
      queue.push(pixel + dataWidth);
    }
  }
};

const shouldUpdatePixel = (
  pixel: number,
  targetColor: number[],
  data: Uint8ClampedArray,
  length: number,
  tolerance: number,
) => {
  if (pixel < 0 || pixel >= length) return false;
  return arePixelEqual(targetColor, [data[pixel], data[pixel + 1], data[pixel + 2]], tolerance);
};

const arePixelEqual = (pixel1: number[], pixel2: number[], tolerance: number) =>
  Math.abs(pixel1[0] - pixel2[0]) <= tolerance &&
  Math.abs(pixel1[1] - pixel2[1]) <= tolerance &&
  Math.abs(pixel1[2] - pixel2[2]) <= tolerance;

const setPixelIfNeeded = (
  pixel: number,
  targetColor: number[],
  fillcolor: RGBAColor,
  data: Uint8ClampedArray,
  length: number,
  tolerance: number,
) => {
  if (shouldUpdatePixel(pixel, targetColor, data, length, tolerance)) {
    data[pixel] = fillcolor.r;
    data[pixel + 1] = fillcolor.g;
    data[pixel + 2] = fillcolor.b;
    data[pixel + 3] = 255;
    return true;
  }
  return false;
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

export const fillContext = (coordinates: Point, canvasRef: canvasRefType, color: string) => {
  if (!canvasRef.current) return;
  const context = canvasRef.current.getContext('2d');
  if (!context) return;

  const image = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
  const data = image.data;
  const { x, y } = coordinates;
  const xi = Math.round(x);
  const yi = Math.round(y);
  const width = image.width;
  const tolerance = 10;
  floodfill(data, xi, yi, hexToRgb(color), tolerance, width);
  context.putImageData(image, 0, 0);
};
