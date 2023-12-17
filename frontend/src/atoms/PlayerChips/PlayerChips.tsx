import cn from 'classnames';
import { playerChips } from './PlayerChips.module.scss';

const PlayerChip: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, color, ...props }) => <div className={cn(playerChips, className)} {...props} />;

export default PlayerChip;
