import React, { HTMLAttributes } from 'react';
import cn from 'classnames';
import { circle, container, rod, selected as selectedClass } from './Switch.module.scss';

type Props = {
  setSelected: (selected: boolean) => void;
  selected: boolean;
};

const Switch: React.FC<Props & HTMLAttributes<HTMLButtonElement>> = ({
  setSelected,
  selected,
  className,
  ...containerProps
}) => (
  <button
    className={cn(container, className)}
    {...containerProps}
    onClick={() => setSelected(!selected)}
  >
    <div className={cn(rod, { [selectedClass]: selected })} />
    <div className={cn(circle, { [selectedClass]: selected })} />
  </button>
);

export default Switch;
