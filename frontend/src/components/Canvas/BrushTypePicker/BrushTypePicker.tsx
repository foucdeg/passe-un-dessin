import React from 'react';
import thickEraserIcon from 'assets/eraser-thick.svg';
import thinEraserIcon from 'assets/eraser-thin.svg';
import paintBrushIcon from 'assets/paint.svg';
import thickBrushIcon from 'assets/pencil-thick.svg';
import thinBrushIcon from 'assets/pencil-thin.svg';
import { BrushBlock, BrushPickerContainer } from './BrushTypePicker.style';

export enum BrushType {
  FILL = 'FILL',
  THICK = 'THICK',
  THIN = 'THIN',
  THICK_ERASER = 'THICK_ERASER',
  THIN_ERASER = 'THIN_ERASER',
}

const icons: { [type: string]: string } = {
  [BrushType.FILL]: paintBrushIcon,
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
    {Object.values(BrushType).map((brushOption) => (
      <BrushBlock
        src={icons[brushOption]}
        key={brushOption}
        onClick={() => setBrushType(brushOption)}
        selected={brushOption === brushType}
        data-test={`brush-type-${brushOption}`}
      />
    ))}
  </BrushPickerContainer>
);

export default BrushColorPicker;
