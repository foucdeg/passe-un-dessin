import cn from 'classnames';
import { fieldLabel } from './FieldLabel.module.scss';

const FieldLabel: React.FC<
  React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
> = ({ className, ...props }) => <label className={cn(fieldLabel, className)} {...props} />;

export default FieldLabel;
