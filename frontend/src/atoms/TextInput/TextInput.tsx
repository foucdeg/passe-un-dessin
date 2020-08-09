import React from 'react';

import { InputAndAdornment, StyledTextInput, AdornmentLocation } from './TextInput.style';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  adornment?: React.ReactNode;
  hasError?: boolean;
};

const TextInput: React.FC<Props> = ({ adornment, className, hasError, ...inputProps }) => (
  <InputAndAdornment className={className} hasError={hasError}>
    <StyledTextInput {...inputProps} />
    {adornment && <AdornmentLocation>{adornment}</AdornmentLocation>}
  </InputAndAdornment>
);

export default TextInput;
