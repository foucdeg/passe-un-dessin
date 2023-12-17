import cn from 'classnames';
import { chipButton } from './ChipButton.module.scss';

const ChipButton: React.FC<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ children, className, ...otherProps }) => {
  return (
    <button className={cn(chipButton, className)} {...otherProps}>
      {children}
    </button>
  );
};

export default ChipButton;
