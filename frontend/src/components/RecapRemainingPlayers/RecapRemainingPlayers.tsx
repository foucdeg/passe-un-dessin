import React, { useCallback } from 'react';
import { useSelector } from 'redux/useSelector';
import { selectRemainingPlayers } from 'redux/Game/selectors';
import { selectPlayerIsAdmin } from 'redux/Room/selectors';
import { useForceState } from 'redux/Game/hooks';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  StyledPlayerChips,
  AdminButton,
  NextStepIcon,
} from 'components/RemainingPlayers/RemainingPlayers.style';
import PlayerChip from 'atoms/PlayerChip';
import { RecapRemainingPlayersContainer, StyledHeader } from './RecapRemainingPlayers.style';
import Spacer from 'atoms/Spacer';

const RecapRemainingPlayers: React.FC<{}> = () => {
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
        {remainingPlayers.map(player => (
          <PlayerChip key={player.uuid} color={player.color}>
            {player.name}
          </PlayerChip>
        ))}
      </StyledPlayerChips>
      {isPlayerAdmin && (
        <>
          <Spacer />
          <AdminButton onClick={forceNextStep}>
            <FormattedMessage id="remainingPlayers.forceNextStep" />
            <NextStepIcon />
          </AdminButton>
        </>
      )}
    </RecapRemainingPlayersContainer>
  );
};

export default RecapRemainingPlayers;
