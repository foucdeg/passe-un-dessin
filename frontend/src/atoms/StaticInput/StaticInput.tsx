import React from 'react';

import { InputAndAdornment, AdornmentLocation, StyledStaticInput } from './StaticInput.style';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  adornment?: React.ReactNode;
};

const StaticInput: React.FC<Props> = ({ adornment, ...inputProps }) => (
  <InputAndAdornment>
    <StyledStaticInput {...inputProps} hasAdornment={!!adornment} />
    {adornment && <AdornmentLocation>{adornment}</AdornmentLocation>}
  </InputAndAdornment>
);

export default StaticInput;
