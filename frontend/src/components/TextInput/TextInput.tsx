import React from 'react';

import { InputAndAdornment, StyledTextInput, AdornmentLocation } from './TextInput.style';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  adornment?: React.ReactNode;
};

const TextInput: React.FC<Props> = ({ adornment, ...inputProps }) => (
  <InputAndAdornment>
    <StyledTextInput {...inputProps} hasAdornment={!!adornment} />
    {adornment && <AdornmentLocation>{adornment}</AdornmentLocation>}
  </InputAndAdornment>
);

export default TextInput;
