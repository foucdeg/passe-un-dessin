import React, { ReactNode } from 'react';
import { IconContainer, StyledTooltip } from './IconAndTooltip.style';

interface Props {
  tooltipText: string;
  className?: string;
  children: ReactNode;
  isRight?: boolean;
}

const IconAndTooltip: React.FC<Props> = ({ tooltipText, children, className, isRight }) => (
  <IconContainer className={className}>
    {children}
    <StyledTooltip isRight={isRight}>{tooltipText}</StyledTooltip>
  </IconContainer>
);

export default IconAndTooltip;
