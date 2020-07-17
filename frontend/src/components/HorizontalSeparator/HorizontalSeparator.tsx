import React from 'react';
import { SeparatorRow, Line, TextContent } from './HorizontalSeparator.style';

interface Props {
  children: React.ReactNode;
}

const HorizontalSeparator: React.FC<Props> = ({ children }) => (
  <SeparatorRow>
    <Line />
    <TextContent>{children}</TextContent>
    <Line />
  </SeparatorRow>
);

export default HorizontalSeparator;
