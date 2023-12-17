import React from 'react';

import cn from 'classnames';
import styles from './BareAnchor.module.scss';

export default function BareAnchor({
  className,
  children,
  ...props
}: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
  return (
    <a className={cn(styles.bareAnchor, className)} {...props}>
      {children}
    </a>
  );
}
