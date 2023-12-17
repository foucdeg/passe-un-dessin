import cn from 'classnames';
import fastForwardIcon from 'assets/fast-forward.svg';
import { nextStepIcon, chipButton } from './ChipButton.module.scss';

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

export const NextStepIcon: React.FC<
  Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, 'src'>
> = ({ className, ...props }) => {
  return (
    <img className={cn(nextStepIcon, className)} src={fastForwardIcon} alt="Next step" {...props} />
  );
};
