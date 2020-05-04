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
  a: number;
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
  height: number,
) => {
  const length = data.length;
  const Q = [];
  let i = (x + y * width) * 4;
  let e = i;
  let w = i;
  let me = width * 4;
  let mw = width * 4;
  const w2 = width * 4;
  const seen: { [point: number]: true } = {};

  const targetcolor = [data[i], data[i + 1], data[i + 2], data[i + 3]];

  if (!pixelCompare(i, targetcolor, fillcolor, data, length, tolerance)) {
    return false;
  }
  Q.push(i);
  while (Q.length) {
    i = Q.pop() as number;
    if (pixelCompareAndSet(i, targetcolor, fillcolor, data, length, tolerance)) {
      e = i;
      w = i;
      mw = Math.floor(i / w2) * w2; //left bound
      me = mw + w2; //right bound
      while (
        mw < w &&
        mw < (w -= 4) &&
        pixelCompareAndSet(w, targetcolor, fillcolor, data, length, tolerance)
      ); //go left until edge hit
      while (
        me > e &&
        me > (e += 4) &&
        pixelCompareAndSet(e, targetcolor, fillcolor, data, length, tolerance)
      ); //go right until edge hit
      for (let j = w + 4; j < e; j += 4) {
        if (j - w2 >= 0 && pixelCompare(j - w2, targetcolor, fillcolor, data, length, tolerance))
          if (!seen[j - w2]) {
            Q.push(j - w2); //queue y-1
            seen[j - w2] = true;
          }
        if (
          j + w2 < length &&
          pixelCompare(j + w2, targetcolor, fillcolor, data, length, tolerance)
        )
          if (!seen[j + w2]) {
            Q.push(j + w2); //queue y+1
            seen[j + w2] = true;
          }
      }
    }
  }
  return data;
};

const pixelCompare = (
  i: number,
  targetcolor: number[],
  fillcolor: RGBAColor,
  data: Uint8ClampedArray,
  length: number,
  tolerance: number,
) => {
  if (i < 0 || i >= length) return false; //out of bounds
  if (data[i + 3] === 0 && fillcolor.a > 0) return true; //surface is invisible and fill is visible

  if (
    Math.abs(targetcolor[3] - fillcolor.a) <= tolerance &&
    Math.abs(targetcolor[0] - fillcolor.r) <= tolerance &&
    Math.abs(targetcolor[1] - fillcolor.g) <= tolerance &&
    Math.abs(targetcolor[2] - fillcolor.b) <= tolerance
  )
    return false; //target is same as fill

  if (
    targetcolor[3] === data[i + 3] &&
    targetcolor[0] === data[i] &&
    targetcolor[1] === data[i + 1] &&
    targetcolor[2] === data[i + 2]
  )
    return true; //target matches surface

  if (
    Math.abs(targetcolor[3] - data[i + 3]) <= 255 - tolerance &&
    Math.abs(targetcolor[0] - data[i]) <= tolerance &&
    Math.abs(targetcolor[1] - data[i + 1]) <= tolerance &&
    Math.abs(targetcolor[2] - data[i + 2]) <= tolerance
  )
    return true; //target to surface within tolerance

  return false; //no match
};

const pixelCompareAndSet = (
  i: number,
  targetcolor: number[],
  fillcolor: RGBAColor,
  data: Uint8ClampedArray,
  length: number,
  tolerance: number,
) => {
  if (pixelCompare(i, targetcolor, fillcolor, data, length, tolerance)) {
    data[i] = fillcolor.r;
    data[i + 1] = fillcolor.g;
    data[i + 2] = fillcolor.b;
    data[i + 3] = fillcolor.a;
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
        a: 255,
      }
    : { r: 0, g: 0, b: 0, a: 1 };
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
  const height = image.height;
  const tolerance = 10;
  floodfill(data, xi, yi, hexToRgb(color), tolerance, width, height);
  context.putImageData(image, 0, 0);
};
