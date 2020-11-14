import React, { useEffect } from 'react';
import { useBoolean } from 'services/utils';
import { OuterTimerBar, InnerTimerBar } from './Timer.style';

interface Props {
  duration: number;
}
const Timer: React.FC<Props> = ({ duration }) => {
  const [started, start] = useBoolean(false);
  useEffect(() => {
    setTimeout(start, 0);
  }, [start]);

  return (
    <OuterTimerBar>
      <InnerTimerBar duration={duration} className={started ? 'started' : ''} />
    </OuterTimerBar>
  );
};

export default Timer;
