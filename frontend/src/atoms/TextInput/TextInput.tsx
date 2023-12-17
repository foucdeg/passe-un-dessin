import React from 'react';

import cn from 'classnames';
import {
  inputAndAdornment,
  textInput,
  adornmentLocation,
  hasError as hasErrorClass,
} from './TextInput.module.scss';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  adornment?: React.ReactNode;
  hasError?: boolean;
};

const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ adornment, className, hasError, ...inputProps }, ref) => (
    <div className={cn(inputAndAdornment, className, { [hasErrorClass]: hasError })}>
      <input className={textInput} {...inputProps} ref={ref} />
      {adornment && <div className={adornmentLocation}>{adornment}</div>}
    </div>
  ),
);

export default TextInput;
