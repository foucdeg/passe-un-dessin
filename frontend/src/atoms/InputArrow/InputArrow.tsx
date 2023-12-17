import cn from 'classnames';
import { inputArrow } from './InputArrow.module.scss';

const InputArrow: React.FC<
  React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = ({ className, alt, ...props }) => {
  return <img className={cn(inputArrow, className)} alt={alt} {...props} />;
};

export default InputArrow;
