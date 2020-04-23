import React, { useState, useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import { TopRightButton, TopRightButtons } from './VoteResults.style';
import { useHistory } from 'react-router';
import { useLeaveRoom } from 'redux/Room/hooks';
import { useGetVoteResults } from 'redux/Game/hooks';
import { selectRoom, selectPlayerIsAdmin } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import NewGameModal from 'components/NewGameModal';
import { FormattedMessage } from 'react-intl';

const GameRecap: React.FunctionComponent = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const history = useHistory();

  const [newGameModalIsOpen, setNewGameModalIsOpen] = useState<boolean>(false);

  const doLeaveRoom = useLeaveRoom();
  const doGetVoteResults = useGetVoteResults();

  useEffect(() => {
    if (game) {
      doGetVoteResults(game.uuid);
    }
  }, [doGetVoteResults, game]);

  if (!room || !game) return null;

  const leaveGame = () => {
    doLeaveRoom(room);
    history.push('/');
  };

  return (
    <>
      <TopRightButtons>
        <TopRightButton onClick={leaveGame}>
          <FormattedMessage id="recap.leaveTeam" />
        </TopRightButton>
        {isPlayerAdmin && (
          <TopRightButton onClick={() => setNewGameModalIsOpen(true)}>
            <FormattedMessage id="recap.newGame" />
          </TopRightButton>
        )}
      </TopRightButtons>
      <NewGameModal isOpen={newGameModalIsOpen} onClose={() => setNewGameModalIsOpen(false)} />
    </>
  );
};

export default GameRecap;
