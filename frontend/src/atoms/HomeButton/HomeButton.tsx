import React from 'react';
import homeIcon from 'assets/home.svg';
import { StyledLink } from './HomeButton.style';

interface Props {
  onClick?: () => void;
}

const HomeButton: React.FC<Props & React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  onClick,
  children,
  ...linkProps
}) => (
  <StyledLink onClick={onClick} to="/" {...linkProps}>
    {children || <img src={homeIcon} alt="Back to Home" />}
  </StyledLink>
);

export default HomeButton;
