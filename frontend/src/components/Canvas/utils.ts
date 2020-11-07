/* eslint-disable max-lines */

export type Point = { x: number; y: number };
export type Line = { points: Point[]; brushColor: string; brushRadius: number; type: 'line' };
export type Fill = { point: Point; color: string; type: 'fill' };
export type Initialization = { drawing: string; type: 'init' };
export type Clear = { type: 'clear' };
export type Step = Line | Fill | Initialization | Clear;
export type Paint = Step[];

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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const initializeCanvas = async (canvasRef: canvasRefType, drawing: string) => {
  if (!canvasRef.current) {
    return;
  }
  const canvas: HTMLCanvasElement = canvasRef.current;
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }
  const img = new Image();
  img.onload = function () {
    context.drawImage(img, 0, 0);
  };
  img.src = drawing;

  // We need await to make this function async because this operation take a few time.
  // If you do not use that, it will erase future modification of drawing appening just after
  await sleep(1);
};

export const drawLine = async (
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
  if (!context) {
    return;
  }

  const x1 = Math.floor(startPosition.x);
  const y1 = Math.floor(startPosition.y);
  const x2 = Math.floor(endPosition.x);
  const y2 = Math.floor(endPosition.y);
  const lineWidth = Math.ceil(brushRadius * 2);
  const canvasWidth = context.canvas.width;
  const canvasHeight = context.canvas.height;

  // calculate bounding box
  const left = Math.max(0, Math.min(canvasWidth, Math.min(x1, x2) - lineWidth));
  const top = Math.max(0, Math.min(canvasHeight, Math.min(y1, y2) - lineWidth));
  const right = Math.max(0, Math.min(canvasWidth, Math.max(x1, x2) + lineWidth));
  const bottom = Math.max(0, Math.min(canvasHeight, Math.max(y1, y2) + lineWidth));

  // off canvas, so don't draw anything
  if (right - left === 0 || bottom - top === 0) {
    return;
  }

  const color = hexToRgb(brushColor);

  const circleMap = generateCircleMap(Math.floor(lineWidth / 2));
  const offset = Math.floor(circleMap.length / 2);

  const imageData = context.getImageData(left, top, right - left, bottom - top);

  for (let ix = 0; ix < circleMap.length; ix++) {
    for (let iy = 0; iy < circleMap[ix].length; iy++) {
      if (circleMap[ix][iy] === 1 || (x1 === x2 && y1 === y2 && circleMap[ix][iy] === 2)) {
        const newX1 = x1 + ix - offset - left;
        const newY1 = y1 + iy - offset - top;
        const newX2 = x2 + ix - offset - left;
        const newY2 = y2 + iy - offset - top;
        drawBresenhamLine(imageData, newX1, newY1, newX2, newY2, color);
      }
    }
  }
  context.putImageData(imageData, left, top);
};

const drawBresenhamLine = (
  imageData: ImageData,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: RGBAColor,
) => {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    //check if pixel is inside the canvas
    if (!(x0 < 0 || x0 >= imageData.width || y0 < 0 || y0 >= imageData.height)) {
      setPixel(imageData, x0, y0, color);
    }

    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
};

const generateCircleMap = (radius: number) => {
  const circleData: number[][] = [];

  for (let x = 0; x < 2 * radius; x++) {
    circleData[x] = [];
    for (let y = 0; y < 2 * radius; y++) {
      const distanceToRadius = Math.sqrt(Math.pow(radius - x, 2) + Math.pow(radius - y, 2));
      if (distanceToRadius > radius) {
        circleData[x][y] = 0;
      } else if (distanceToRadius < radius - 2) {
        //optimize for performance: fill circle only when mouse was not moved
        circleData[x][y] = 2;
      } else {
        circleData[x][y] = 1;
      }
    }
  }

  return circleData;
};

const setPixel = (imageData: ImageData, x: number, y: number, color: RGBAColor) => {
  const offset = (y * imageData.width + x) * 4;
  imageData.data[offset] = color.r;
  imageData.data[offset + 1] = color.g;
  imageData.data[offset + 2] = color.b;
  imageData.data[offset + 3] = 255;
};

const findLastClearIndex = (paint: Paint) => {
  const firstReversedClearIndex = paint
    .slice()
    .reverse()
    .findIndex((step: Step) => step.type === 'clear');
  if (firstReversedClearIndex === -1) {
    return -1;
  }
  return paint.length - firstReversedClearIndex - 1;
};

export const drawPaint = async (paint: Paint, canvasRef: canvasRefType) => {
  // Do not use foreach because initializeCanvas need to use async
  const lastClearIndex = findLastClearIndex(paint);
  const startIndex = lastClearIndex === -1 ? 0 : lastClearIndex;
  for (let i = startIndex; i < paint.length; i++) {
    const paintStep = paint[i];
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
      case 'clear':
        resetCanvas(canvasRef);
        break;
      case 'init':
        await initializeCanvas(canvasRef, paintStep.drawing);
        break;
      default:
        break;
    }
  }
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
      pushIfPixelAreOnTheSameLine(queue, pixel, pixel - 4, dataWidth);
      pushIfPixelAreOnTheSameLine(queue, pixel, pixel + 4, dataWidth);
      queue.push(pixel - dataWidth);
      queue.push(pixel + dataWidth);
    }
  }
};

const pushIfPixelAreOnTheSameLine = (
  queue: number[],
  currentPixel: number,
  newPixel: number,
  dataWidth: number,
) => {
  if (Math.floor(currentPixel / dataWidth) === Math.floor(newPixel / dataWidth)) {
    queue.push(newPixel);
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
