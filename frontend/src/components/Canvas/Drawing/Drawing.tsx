import React from 'react';
import { FormattedMessage } from 'react-intl';
import { StyledDrawing } from './Drawing.style';

interface Props {
  src: string | null;
  className?: string;
}

const Drawing: React.FC<Props> = ({ src, className }) => {
  if (!src)
    return (
      <div>
        <FormattedMessage id="drawingToWord.noDrawing" />
      </div>
    );

  return <StyledDrawing src={src} className={className} data-test="drawing" />;
};

export default Drawing;
