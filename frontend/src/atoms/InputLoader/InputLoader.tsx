import React from 'react';
import cn from 'classnames';
import { outerLoader, innerLoader } from './InputLoader.module.scss';

const InputLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn(outerLoader, className)} {...props}>
    <div className={innerLoader}>
      <div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
);

export default InputLoader;
