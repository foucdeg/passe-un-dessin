import React from 'react';

import { InputAndAdornment, StyledTextInput, AdornmentLocation } from './TextInput.style';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  adornment?: React.ReactNode;
};

const TextInput: React.FC<Props> = ({ adornment, className, ...inputProps }) => (
  <InputAndAdornment className={className}>
    <StyledTextInput {...inputProps} />
    {adornment && <AdornmentLocation>{adornment}</AdornmentLocation>}
  </InputAndAdornment>
);

export default TextInput;
