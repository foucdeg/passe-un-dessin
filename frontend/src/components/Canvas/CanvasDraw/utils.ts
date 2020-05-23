import { DrawingColor } from 'components/Canvas/BrushColorPicker/BrushColorPicker';
import { BrushType } from 'components/Canvas/BrushTypePicker/BrushTypePicker';
import beigeMediumPointCursor from './assets/beige-medium-point.svg';
import beigePaintCursor from './assets/beige-paint.svg';
import beigeSmallPointCursor from './assets/beige-small-point.svg';
import blackMediumPointCursor from './assets/black-medium-point.svg';
import blackPaintCursor from './assets/black-paint.svg';
import blackSmallPointCursor from './assets/black-small-point.svg';
import blueMediumPointCursor from './assets/blue-medium-point.svg';
import bluePaintCursor from './assets/blue-paint.svg';
import blueSmallPointCursor from './assets/blue-small-point.svg';
import brownMediumPointCursor from './assets/brown-medium-point.svg';
import brownPaintCursor from './assets/brown-paint.svg';
import brownSmallPointCursor from './assets/brown-small-point.svg';
import greenMediumPointCursor from './assets/green-medium-point.svg';
import greenPaintCursor from './assets/green-paint.svg';
import greenSmallPointCursor from './assets/green-small-point.svg';
import greyMediumPointCursor from './assets/grey-medium-point.svg';
import greyPaintCursor from './assets/grey-paint.svg';
import greySmallPointCursor from './assets/grey-small-point.svg';
import orangeMediumPointCursor from './assets/orange-medium-point.svg';
import orangePaintCursor from './assets/orange-paint.svg';
import orangeSmallPointCursor from './assets/orange-small-point.svg';
import pinkMediumPointCursor from './assets/pink-medium-point.svg';
import pinkPaintCursor from './assets/pink-paint.svg';
import pinkSmallPointCursor from './assets/pink-small-point.svg';
import redMediumPointCursor from './assets/red-medium-point.svg';
import redPaintCursor from './assets/red-paint.svg';
import redSmallPointCursor from './assets/red-small-point.svg';
import skyblueMediumPointCursor from './assets/skyblue-medium-point.svg';
import skybluePaintCursor from './assets/skyblue-paint.svg';
import skyblueSmallPointCursor from './assets/skyblue-small-point.svg';
import whiteBigPointCursor from './assets/white-big-point.svg';
import whiteMediumPointCursor from './assets/white-medium-point.svg';
import whitePaintCursor from './assets/white-paint.svg';
import whiteSmallPointCursor from './assets/white-small-point.svg';
import yellowMediumPointCursor from './assets/yellow-medium-point.svg';
import yellowPaintCursor from './assets/yellow-paint.svg';
import yellowSmallPointCursor from './assets/yellow-small-point.svg';

type BrushRadiusType = 0 | 2 | 6 | 10;

const BRUSH_TYPE_TO_BRUSH_RADIUS: { [brushType: string]: BrushRadiusType } = {
  [BrushType.THICK_ERASER]: 10,
  [BrushType.THIN_ERASER]: 2,
  [BrushType.THICK]: 6,
  [BrushType.THIN]: 2,
  [BrushType.FILL]: 0,
};

const BRUSH_RADIUS_AND_COLOR_TO_CURSOR = {
  [DrawingColor.BEIGE]: {
    0: beigePaintCursor,
    2: beigeSmallPointCursor,
    6: beigeMediumPointCursor,
    10: '',
  },
  [DrawingColor.BLACK]: {
    0: blackPaintCursor,
    2: blackSmallPointCursor,
    6: blackMediumPointCursor,
    10: '',
  },
  [DrawingColor.BLUE]: {
    0: bluePaintCursor,
    2: blueSmallPointCursor,
    6: blueMediumPointCursor,
    10: '',
  },
  [DrawingColor.BROWN]: {
    0: brownPaintCursor,
    2: brownSmallPointCursor,
    6: brownMediumPointCursor,
    10: '',
  },
  [DrawingColor.GREEN]: {
    0: greenPaintCursor,
    2: greenSmallPointCursor,
    6: greenMediumPointCursor,
    10: '',
  },
  [DrawingColor.GREY]: {
    0: greyPaintCursor,
    2: greySmallPointCursor,
    6: greyMediumPointCursor,
    10: '',
  },
  [DrawingColor.ORANGE]: {
    0: orangePaintCursor,
    2: orangeSmallPointCursor,
    6: orangeMediumPointCursor,
    10: '',
  },
  [DrawingColor.PINK]: {
    0: pinkPaintCursor,
    2: pinkSmallPointCursor,
    6: pinkMediumPointCursor,
    10: '',
  },
  [DrawingColor.RED]: {
    0: redPaintCursor,
    2: redSmallPointCursor,
    6: redMediumPointCursor,
    10: '',
  },
  [DrawingColor.SKYBLUE]: {
    0: skybluePaintCursor,
    2: skyblueSmallPointCursor,
    6: skyblueMediumPointCursor,
    10: '',
  },
  [DrawingColor.YELLOW]: {
    0: yellowPaintCursor,
    2: yellowSmallPointCursor,
    6: yellowMediumPointCursor,
    10: '',
  },
  ['#FFFFFF' as DrawingColor]: {
    0: whitePaintCursor,
    2: whiteSmallPointCursor,
    6: whiteMediumPointCursor,
    10: whiteBigPointCursor,
  },
};

export const getBrushAttributes = (
  color: DrawingColor,
  brushType: BrushType,
): [DrawingColor, number, boolean, string] => {
  const isEraserSelected = [BrushType.THICK_ERASER, BrushType.THIN_ERASER].includes(brushType);
  const usedColor = (isEraserSelected ? '#FFFFFF' : color) as DrawingColor;
  const isFillSelected = brushType === BrushType.FILL;
  const brushRadius = BRUSH_TYPE_TO_BRUSH_RADIUS[brushType] as BrushRadiusType;
  const cursorImage = BRUSH_RADIUS_AND_COLOR_TO_CURSOR[usedColor][brushRadius];

  return [usedColor, brushRadius, isFillSelected, cursorImage];
};
