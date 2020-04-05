import React, { useEffect, useState } from 'react';
import { OuterTimerBar, InnerTimerBar } from './TimerBar.style';

interface Props {
  duration: number;
}
const TimerBar: React.FC<Props> = ({ duration }) => {
  const [started, setStarted] = useState<boolean>(false);
  useEffect(() => {
    setStarted(true);
  }, []);

  return (
    <OuterTimerBar>
      <InnerTimerBar duration={duration} className={started ? 'started' : ''} />
    </OuterTimerBar>
  );
};

export default TimerBar;
