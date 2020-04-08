import React from 'react';

import { BrushPickerContainer, ColorBlock } from './BrushColorPicker.style';

export enum DrawingColor {
  GREEN = '#44962A',
  BLUE = '#0023F5',
  YELLOW = '#FFCF25',
  ORANGE = '#F29D39',
  BROWN = '#9C5127',
  RED = '#EB3323',
  PINK = '#EA3FF7',
  BLACK = '#000000',
}

interface Props {
  color: DrawingColor;
  setColor: (color: DrawingColor) => void;
}

const BrushColorPicker: React.FC<Props> = ({ color, setColor }) => (
  <BrushPickerContainer>
    {Object.values(DrawingColor).map(colorOption => (
      <ColorBlock
        key={colorOption}
        onClick={() => setColor(colorOption)}
        color={colorOption}
        selected={colorOption === color}
      />
    ))}
  </BrushPickerContainer>
);

export default BrushColorPicker;
