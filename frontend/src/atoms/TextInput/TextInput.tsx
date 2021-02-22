import React from 'react';

import { InputAndAdornment, StyledTextInput, AdornmentLocation } from './TextInput.style';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  adornment?: React.ReactNode;
  hasError?: boolean;
};

const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ adornment, className, hasError, ...inputProps }, ref) => (
    <InputAndAdornment className={className} hasError={hasError}>
      <StyledTextInput {...inputProps} ref={ref} />
      {adornment && <AdornmentLocation>{adornment}</AdornmentLocation>}
    </InputAndAdornment>
  ),
);

export default TextInput;
