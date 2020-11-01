import React, { useCallback } from 'react';
import { useSelector } from 'redux/useSelector';
import { selectRemainingPlayers } from 'redux/Game/selectors';
import { selectPlayerIsAdmin } from 'redux/Room/selectors';
import { useForceState } from 'redux/Game/hooks';
import { useIntl, FormattedMessage } from 'react-intl';
import { StyledPlayerChips } from 'components/RemainingPlayers/RemainingPlayers.style';
import PlayerChip from 'atoms/PlayerChip';
import Spacer from 'atoms/Spacer';
import { EmptyObject } from 'services/utils';
import ChipButton, { NextStepIcon } from 'atoms/ChipButton';
import { RecapRemainingPlayersContainer, StyledHeader } from './RecapRemainingPlayers.style';

const RecapRemainingPlayers: React.FC<EmptyObject> = () => {
  const remainingPlayers = useSelector(selectRemainingPlayers);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const [, doForceState] = useForceState();
  const intl = useIntl();

  const forceNextStep = useCallback(() => {
    if (window.confirm(intl.formatMessage({ id: 'recap.confirmForceNextStep' }))) {
      doForceState();
    }
  }, [doForceState, intl]);

  return (
    <RecapRemainingPlayersContainer>
      <StyledHeader>
        <FormattedMessage id="recap.waitingFor" />
      </StyledHeader>
      <StyledPlayerChips>
        {remainingPlayers.map((player) => (
          <PlayerChip key={player.uuid} color={player.color}>
            {player.name}
          </PlayerChip>
        ))}
      </StyledPlayerChips>
      {isPlayerAdmin && (
        <>
          <Spacer />
          <ChipButton onClick={forceNextStep}>
            <FormattedMessage id="recap.forceNextStep" />
            <NextStepIcon />
          </ChipButton>
        </>
      )}
    </RecapRemainingPlayersContainer>
  );
};

export default RecapRemainingPlayers;
