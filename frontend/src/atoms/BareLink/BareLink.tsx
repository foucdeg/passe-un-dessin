import { Link, LinkProps } from 'react-router-dom';
import cn from 'classnames';
import { bareLink } from './BareLink.module.scss';

const BareLink: React.FC<LinkProps> = ({ children, className, ...otherProps }) => {
  return (
    <Link className={cn(bareLink, className)} {...otherProps}>
      {children}
    </Link>
  );
};

export default BareLink;
