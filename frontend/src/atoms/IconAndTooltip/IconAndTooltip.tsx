import React, { ReactNode } from 'react';
import cn from 'classnames';
import { iconContainer, tooltip } from './IconAndTooltip.module.scss';

interface Props {
  tooltipText: string;
  className?: string;
  children: ReactNode;
  isRight?: boolean;
}

const IconAndTooltip: React.FC<Props> = ({ tooltipText, children, className, isRight }) => (
  <span className={cn(iconContainer, className)}>
    {children}
    <span className={cn(tooltip, { right: isRight, left: !isRight })}>{tooltipText}</span>
  </span>
);

export default IconAndTooltip;
