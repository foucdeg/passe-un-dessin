import cn from 'classnames';
import { playerChip } from './PlayerChip.module.scss';

const PlayerChip: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { color?: string }
> = ({ className, color, ...props }) => (
  <div
    className={cn(playerChip, className)}
    style={color ? { backgroundColor: color } : undefined}
    {...props}
  />
);

export default PlayerChip;
