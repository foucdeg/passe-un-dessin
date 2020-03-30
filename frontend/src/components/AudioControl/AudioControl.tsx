import React, { useRef, useEffect, useState } from 'react';

const AudioControl: React.FC = () => {
  const audioElt = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioElt.current) return;
    const currentElt = audioElt.current;

    const playingListener = () => setPlaying(true);
    currentElt.addEventListener('play', playingListener);

    const pausedListener = () => setPlaying(false);
    currentElt.addEventListener('pause', pausedListener);

    return () => {
      currentElt.removeEventListener('play', playingListener);
      currentElt.removeEventListener('pause', pausedListener);
    };
  }, [audioElt]);

  const play = () => audioElt.current?.play();

  const pause = () => audioElt?.current?.pause();

  return (
    <>
      <audio autoPlay loop ref={audioElt}>
        <source src="/JeffSpeed68-Ultra-Lights.mp3" />
        Your browser does not support the audio element.
      </audio>
      {playing ? <span onClick={pause}>Pause</span> : <span onClick={play}>Play</span>}
    </>
  );
};

export default AudioControl;
