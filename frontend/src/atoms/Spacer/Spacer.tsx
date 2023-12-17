import cn from 'classnames';
import { spacer } from './Spacer.module.scss';

const Spacer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn(spacer, className)} {...props} />
);

export default Spacer;
