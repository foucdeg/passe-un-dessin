import React, { ReactNode } from 'react';
import { IconContainer, StyledTooltip } from './IconAndTooltip.style';

interface Props {
  tooltipText: string;
  className?: string;
  children: ReactNode;
}

const IconAndTooltip: React.FC<Props> = ({ tooltipText, children, className }) => (
  <IconContainer className={className}>
    {children}
    <StyledTooltip>{tooltipText}</StyledTooltip>
  </IconContainer>
);

export default IconAndTooltip;
