import React from 'react';

import { BrushPickerContainer, ColorBlock, Eraser } from './BrushPicker.style';

export enum DrawingColor {
  BLACK = '#000000',
  BLUE = '#0000ff',
  GREEN = '#009900',
  YELLOW = '#f0ed3a',
  ORANGE = '#ff9900',
  RED = '#ff0000',
  PINK = '#ff00ff',
  WHITE = '#ffffff',
}

interface Props {
  color: DrawingColor;
  setColor: (color: DrawingColor) => void;
}

const BrushPicker: React.FC<Props> = ({ color, setColor }) => (
  <BrushPickerContainer>
    {Object.values(DrawingColor).map(colorOption => (
      <div key={colorOption} onClick={() => setColor(colorOption)}>
        {colorOption === DrawingColor.WHITE ? (
          <Eraser selected={colorOption === color} />
        ) : (
          <ColorBlock color={colorOption} selected={colorOption === color} />
        )}
      </div>
    ))}
  </BrushPickerContainer>
);

export default BrushPicker;
