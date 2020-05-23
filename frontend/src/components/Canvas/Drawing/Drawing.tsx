import React from 'react';
import { FormattedMessage } from 'react-intl';
import { StyledDrawing } from './Drawing.style';

interface Props {
  data: string | null;
  className?: string;
}

const Drawing: React.FC<Props> = ({ data, className }) => {
  if (!data)
    return (
      <div>
        <FormattedMessage id="drawingToWord.noDrawing" />
      </div>
    );

  return <StyledDrawing src={data} className={className} />;
};

export default Drawing;
