import React from 'react';
import { SeparatorRow, Line, SeparatorText } from './HorizontalSeparator.style';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const HorizontalSeparator: React.FC<Props> = ({ children, className }) => (
  <SeparatorRow className={className}>
    <Line />
    <SeparatorText>{children}</SeparatorText>
    <Line />
  </SeparatorRow>
);

export default HorizontalSeparator;
