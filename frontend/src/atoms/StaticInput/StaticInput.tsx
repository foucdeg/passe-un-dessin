import React from 'react';

import { InputAndAdornment, AdornmentLocation, StyledStaticInput } from './StaticInput.style';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  adornment?: React.ReactNode;
};

const StaticInput: React.FC<Props> = ({ adornment, className, ...inputProps }) => (
  <InputAndAdornment className={className}>
    <StyledStaticInput {...inputProps} hasAdornment={!!adornment} />
    {adornment && <AdornmentLocation>{adornment}</AdornmentLocation>}
  </InputAndAdornment>
);

export default StaticInput;
