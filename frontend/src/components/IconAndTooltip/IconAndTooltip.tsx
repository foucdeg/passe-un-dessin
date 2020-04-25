import React, { ReactNode } from 'react';
import CSS from 'csstype';
import { IconContainer, StyledTooltip } from './IconAndTooltip.style';

interface Props {
  tooltipText: string;
  className?: string;
  children: ReactNode;
  tooltipStyle?: CSS.Properties;
}

const IconAndTooltip: React.FC<Props> = ({ tooltipText, children, className, tooltipStyle }) => (
  <IconContainer className={className}>
    {children}
    <StyledTooltip style={tooltipStyle}>{tooltipText}</StyledTooltip>
  </IconContainer>
);

export default IconAndTooltip;
