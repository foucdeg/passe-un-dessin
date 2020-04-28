import React from 'react';
import { Container } from './Podium.style';
import { PadStep } from 'redux/Game/types';
import podium from 'assets/podium.svg';

import PodiumStep from 'components/PodiumStep';

interface Props {
  winners: PadStep[];
}

const Podium: React.FC<Props> = ({ winners }) => {
  return (
    <Container>
      <img src={podium} alt="Podium" />
      {winners[0] && (
        <PodiumStep height={300} left={166} width={198} bottom={180} winner={winners[0]} />
      )}
      {winners[1] && (
        <PodiumStep height={260} left={0} width={166} bottom={115} winner={winners[1]} />
      )}
      {winners[2] && (
        <PodiumStep height={260} left={363} width={171} bottom={85} winner={winners[2]} />
      )}
    </Container>
  );
};

export default Podium;
