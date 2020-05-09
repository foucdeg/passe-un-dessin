import React from 'react';
import { useIntl } from 'react-intl';

import IconAndTooltip from 'components/IconAndTooltip';

import { BrushPickerContainer, ColorBlock } from './BrushColorPicker.style';

export enum DrawingColor {
  GREEN = '#44962A',
  BLUE = '#0023F5',
  SKYBLUE = '#4acfff',
  BEIGE = '#FFE2B0',
  YELLOW = '#FFCF25',
  ORANGE = '#F29D39',
  BROWN = '#9C5127',
  RED = '#EB3323',
  PINK = '#EA3FF7',
  GREY = '#BDBDBD',
  BLACK = '#000000',
}

interface Props {
  color: DrawingColor;
  setColor: (color: DrawingColor) => void;
}

const BrushColorPicker: React.FC<Props> = ({ color, setColor }) => {
  const intl = useIntl();
  return (
    <BrushPickerContainer>
      {Object.entries(DrawingColor).map(([colorKey, colorOption]) => (
        <IconAndTooltip
          tooltipText={intl.formatMessage({ id: `color.${colorKey.toLowerCase()}` })}
          key={colorOption}
        >
          <ColorBlock
            onClick={() => setColor(colorOption)}
            color={colorOption}
            selected={colorOption === color}
          />
        </IconAndTooltip>
      ))}
    </BrushPickerContainer>
  );
};

export default BrushColorPicker;
