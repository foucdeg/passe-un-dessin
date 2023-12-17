import React from 'react';
import cn from 'classnames';
import { Header4 } from 'atoms/Headers';
import { separatorRow, line, separatorText } from './HorizontalSeparator.module.scss';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const HorizontalSeparator: React.FC<Props> = ({ children, className }) => (
  <div className={cn(separatorRow, className)}>
    <div className={line} />
    <Header4 className={separatorText}>{children}</Header4>
    <div className={line} />
  </div>
);

export default HorizontalSeparator;
