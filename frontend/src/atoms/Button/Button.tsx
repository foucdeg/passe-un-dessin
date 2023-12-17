import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import cn from 'classnames';
import styles from './Button.module.scss';

export interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
  target?: string;
}

const Button: React.FC<ButtonProps> = ({ to, children, ...otherProps }) => {
  if (to) {
    return (
      <BaseLink to={to} {...otherProps}>
        {children}
      </BaseLink>
    );
  }

  return <BaseButton {...otherProps}>{children}</BaseButton>;
};

export default Button;

function BaseLink({
  children,
  className,
  disabled,
  ...otherProps
}: LinkProps & { disabled?: boolean }) {
  return (
    <Link
      className={cn(styles['button'], className, { [styles.disabled]: disabled })}
      {...otherProps}
    >
      {children}
    </Link>
  );
}

function BaseButton({
  children,
  className,
  disabled,
  ...otherProps
}: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <button
      className={cn(styles['button'], className, { [styles.disabled]: disabled })}
      {...otherProps}
    >
      {children}
    </button>
  );
}
