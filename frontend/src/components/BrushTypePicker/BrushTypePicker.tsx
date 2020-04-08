import React from 'react';

import thickBrushIcon from 'assets/pencil-thick.svg';
import thinBrushIcon from 'assets/pencil-thin.svg';
import thickEraserIcon from 'assets/eraser-thick.svg';
import thinEraserIcon from 'assets/eraser-thin.svg';

import { BrushPickerContainer, BrushBlock } from './BrushTypePicker.style';

export enum BrushType {
  THICK = 'THICK',
  THIN = 'THIN',
  THICK_ERASER = 'THICK_ERASER',
  THIN_ERASER = 'THIN_ERASER',
}

const icons: { [type: string]: string } = {
  [BrushType.THICK]: thickBrushIcon,
  [BrushType.THIN]: thinBrushIcon,
  [BrushType.THICK_ERASER]: thickEraserIcon,
  [BrushType.THIN_ERASER]: thinEraserIcon,
};

interface Props {
  brushType: BrushType;
  setBrushType: (color: BrushType) => void;
}

const BrushColorPicker: React.FC<Props> = ({ brushType, setBrushType }) => (
  <BrushPickerContainer>
    {Object.values(BrushType).map(brushOption => (
      <BrushBlock
        src={icons[brushOption]}
        key={brushOption}
        onClick={() => setBrushType(brushOption)}
        selected={brushOption === brushType}
      />
    ))}
  </BrushPickerContainer>
);

export default BrushColorPicker;
