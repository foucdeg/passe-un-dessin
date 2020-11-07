import React from 'react';
import { PadStep } from 'redux/Game/types';

import PodiumStep from 'pages/VoteResults/components/PodiumStep';
import { Container } from './Podium.style';

interface Props {
  winners: PadStep[];
}

const Podium: React.FC<Props> = ({ winners }) => {
  return (
    <Container>
      <PodiumStep width={166} winner={winners[1]} ranking={2} />
      <PodiumStep width={197} winner={winners[0]} ranking={1} />
      <PodiumStep width={171} winner={winners[2]} ranking={3} />
    </Container>
  );
};

export default Podium;
