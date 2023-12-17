import cn from 'classnames';
import arrowRight from 'assets/arrow-right.svg';
import { inputArrow } from './InputArrow.module.scss';

const InputArrow: React.FC<
  Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, 'src'>
> = ({ className, ...props }) => {
  return <img className={cn(inputArrow, className)} src={arrowRight} alt="Submit" {...props} />;
};

export default InputArrow;
