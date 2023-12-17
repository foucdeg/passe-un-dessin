import Button from 'atoms/Button';
import { ButtonProps } from 'atoms/Button/Button';

import cn from 'classnames';

import { secondaryButton } from './SecondaryButton.module.scss';

const SecondaryButton: React.FC<ButtonProps> = ({ className, ...props }) => {
  return <Button className={cn(secondaryButton, className)} {...props} />;
};
export default SecondaryButton;
