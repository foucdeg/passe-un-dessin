import React from 'react';
import cn from 'classnames';
import { header2, header3, header4 } from './Headers.module.scss';

export const Header2: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = ({ className, children, ...props }) => {
  return (
    <h2 className={cn(header2, className)} {...props}>
      {children}
    </h2>
  );
};

export const Header3: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = ({ className, children, ...props }) => {
  return (
    <h2 className={cn(header3, className)} {...props}>
      {children}
    </h2>
  );
};

export const Header4: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = ({ className, children, ...props }) => {
  return (
    <h2 className={cn(header4, className)} {...props}>
      {children}
    </h2>
  );
};
