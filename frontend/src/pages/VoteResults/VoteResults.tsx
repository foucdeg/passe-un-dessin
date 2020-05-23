import React, { useState, useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import { useGetVoteResults } from 'redux/Game/hooks';
import { selectRoom, selectPlayerIsAdmin } from 'redux/Room/selectors';
import { selectGame, selectWinners } from 'redux/Game/selectors';
import NewGameModal from 'components/NewGameModal';
import Podium from 'components/Podium';
import { FormattedMessage } from 'react-intl';
import TopRightButtons from 'atoms/TopRightButtons';
import TopRightButton from 'atoms/TopRightButton';
import { Container } from './VoteResults.style';
import Scoreboard from 'components/Scoreboard';

const VoteResults: React.FunctionComponent = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const winners = useSelector(selectWinners);

  const [newGameModalIsOpen, setNewGameModalIsOpen] = useState<boolean>(false);

  const doGetVoteResults = useGetVoteResults();

  useEffect(() => {
    if (game && room) {
      doGetVoteResults(game.uuid, room.uuid);
    }
  }, [doGetVoteResults, game, room]);

  if (!room || !game) return null;

  return (
    <Container>
      {winners && (winners.length ? <Podium winners={winners} /> : <div>No votes</div>)}
      <Scoreboard />
      {isPlayerAdmin && (
        <TopRightButtons>
          <TopRightButton onClick={() => setNewGameModalIsOpen(true)}>
            <FormattedMessage id="voteResults.newGame" />
          </TopRightButton>
        </TopRightButtons>
      )}
      <NewGameModal isOpen={newGameModalIsOpen} onClose={() => setNewGameModalIsOpen(false)} />
    </Container>
  );
};

export default VoteResults;
