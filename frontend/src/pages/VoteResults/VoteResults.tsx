import React, { useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import { useGetVoteResults } from 'redux/Game/hooks';
import { selectRoom, selectPlayerIsAdmin } from 'redux/Room/selectors';
import { selectGame, selectWinners } from 'redux/Game/selectors';
import NewGameModal from 'modals/NewGameModal';
import { FormattedMessage } from 'react-intl';
import Spacer from 'atoms/Spacer';
import BareLink from 'atoms/BareLink';
import { useBoolean } from 'services/utils';
import Loader from 'atoms/Loader';
import Podium from './components/Podium';
import {
  Container,
  TopRightButtons,
  TopRightButton,
  LeftSide,
  StyledHeader,
  StyledLaunchIcon,
  RightSide,
  Donate,
} from './VoteResults.style';
import GameRoomScoreboard from './components/GameRoomScoreboard';

const VoteResults: React.FunctionComponent = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const winners = useSelector(selectWinners);

  const [modalIsOpen, openModal, closeModal] = useBoolean(false);

  const doGetVoteResults = useGetVoteResults();

  useEffect(() => {
    if (game && room) {
      doGetVoteResults(game.uuid, room.uuid);
    }
  }, [doGetVoteResults, game, room]);

  if (!room || !game) return null;

  return (
    <Container>
      <LeftSide>
        <StyledHeader>
          <FormattedMessage id="voteResults.bestMoments" />
        </StyledHeader>
        <Spacer />
        {winners ? winners.length ? <Podium winners={winners} /> : <div>No votes</div> : <Loader />}
      </LeftSide>
      <RightSide>
        <GameRoomScoreboard />
        <Donate>
          <FormattedMessage
            id="voteResults.donate"
            values={{
              a: (...chunks: string[]) => (
                <a href="https://utip.io/passeundessin" target="_blank" rel="noreferrer">
                  {chunks}
                </a>
              ),
            }}
          />
        </Donate>
      </RightSide>
      <TopRightButtons>
        <BareLink to={`/game/${game.uuid}`} target="_blank">
          <TopRightButton>
            <FormattedMessage id="voteResults.reviewGame" />
            <StyledLaunchIcon />
          </TopRightButton>
        </BareLink>
        {isPlayerAdmin && (
          <TopRightButton onClick={openModal}>
            <FormattedMessage id="voteResults.newGame" />
          </TopRightButton>
        )}
      </TopRightButtons>
      <NewGameModal isOpen={modalIsOpen} onClose={closeModal} />
    </Container>
  );
};

export default VoteResults;
