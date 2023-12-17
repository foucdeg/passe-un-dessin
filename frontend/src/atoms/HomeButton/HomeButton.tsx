import React from 'react';
import homeIcon from 'assets/home.svg';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { homeButton } from './HomeButton.module.scss';
interface Props {
  onClick?: () => void;
}

const HomeButton: React.FC<Props & React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  onClick,
  children,
  className,
  ...linkProps
}) => (
  <Link className={cn(homeButton, className)} onClick={onClick} to="/" {...linkProps}>
    {children || <img src={homeIcon} alt="Back to Home" />}
  </Link>
);

export default HomeButton;
