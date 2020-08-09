import React, { useEffect, useState } from 'react';
import { OuterTimerBar, InnerTimerBar } from './Timer.style';

interface Props {
  duration: number;
}
const Timer: React.FC<Props> = ({ duration }) => {
  const [started, setStarted] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => setStarted(true), 0);
  }, []);

  return (
    <OuterTimerBar>
      <InnerTimerBar duration={duration} className={started ? 'started' : ''} />
    </OuterTimerBar>
  );
};

export default Timer;
