import { DrawingColor } from 'components/Canvas/BrushColorPicker/BrushColorPicker';
import { BrushType } from 'components/Canvas/BrushTypePicker/BrushTypePicker';
import beigeMediumPointCursor from './assets/beige-medium-point.png';
import beigePaintCursor from './assets/beige-paint.png';
import beigeSmallPointCursor from './assets/beige-small-point.png';
import blackMediumPointCursor from './assets/black-medium-point.png';
import blackPaintCursor from './assets/black-paint.png';
import blackSmallPointCursor from './assets/black-small-point.png';
import blueMediumPointCursor from './assets/blue-medium-point.png';
import bluePaintCursor from './assets/blue-paint.png';
import blueSmallPointCursor from './assets/blue-small-point.png';
import brownMediumPointCursor from './assets/brown-medium-point.png';
import brownPaintCursor from './assets/brown-paint.png';
import brownSmallPointCursor from './assets/brown-small-point.png';
import greenMediumPointCursor from './assets/green-medium-point.png';
import greenPaintCursor from './assets/green-paint.png';
import greenSmallPointCursor from './assets/green-small-point.png';
import greyMediumPointCursor from './assets/grey-medium-point.png';
import greyPaintCursor from './assets/grey-paint.png';
import greySmallPointCursor from './assets/grey-small-point.png';
import limeMediumPointCursor from './assets/lime-medium-point.png';
import limePaintCursor from './assets/lime-paint.png';
import limeSmallPointCursor from './assets/lime-small-point.png';
import orangeMediumPointCursor from './assets/orange-medium-point.png';
import orangePaintCursor from './assets/orange-paint.png';
import orangeSmallPointCursor from './assets/orange-small-point.png';
import pinkMediumPointCursor from './assets/pink-medium-point.png';
import pinkPaintCursor from './assets/pink-paint.png';
import pinkSmallPointCursor from './assets/pink-small-point.png';
import purpleMediumPointCursor from './assets/purple-medium-point.png';
import purplePaintCursor from './assets/purple-paint.png';
import purpleSmallPointCursor from './assets/purple-small-point.png';
import redMediumPointCursor from './assets/red-medium-point.png';
import redPaintCursor from './assets/red-paint.png';
import redSmallPointCursor from './assets/red-small-point.png';
import skyblueMediumPointCursor from './assets/skyblue-medium-point.png';
import skybluePaintCursor from './assets/skyblue-paint.png';
import skyblueSmallPointCursor from './assets/skyblue-small-point.png';
import whiteBigPointCursor from './assets/white-big-point.png';
import whiteMediumPointCursor from './assets/white-medium-point.png';
import whitePaintCursor from './assets/white-paint.png';
import whiteSmallPointCursor from './assets/white-small-point.png';
import yellowMediumPointCursor from './assets/yellow-medium-point.png';
import yellowPaintCursor from './assets/yellow-paint.png';
import yellowSmallPointCursor from './assets/yellow-small-point.png';

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
  [DrawingColor.LIME]: {
    0: limePaintCursor,
    2: limeSmallPointCursor,
    6: limeMediumPointCursor,
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
  [DrawingColor.PURPLE]: {
    0: purplePaintCursor,
    2: purpleSmallPointCursor,
    6: purpleMediumPointCursor,
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
