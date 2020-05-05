import React from 'react';
import { OuterContainer, Container, StyledHeader } from './Podium.style';
import { PadStep } from 'redux/Game/types';

import PodiumStep from 'components/PodiumStep';
import { FormattedMessage } from 'react-intl';
import Spacer from 'atoms/Spacer';

interface Props {
  winners: PadStep[];
}

const Podium: React.FC<Props> = ({ winners }) => {
  return (
    <OuterContainer>
      <StyledHeader>
        <FormattedMessage id="voteResults.bestDrawings" />
      </StyledHeader>
      <Spacer />
      <Container>
        <PodiumStep width={166} winner={winners[1]} ranking={2} />
        <PodiumStep width={197} winner={winners[0]} ranking={1} />
        <PodiumStep width={171} winner={winners[2]} ranking={3} />
      </Container>
    </OuterContainer>
  );
};

export default Podium;
