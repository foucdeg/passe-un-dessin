/* eslint-disable react/no-array-index-key */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import PadRecap from 'components/PadRecap';
import {
  OuterRecapContainer,
  GameRecapContainer,
  StyledModal,
  StyledButton,
  PadTabsRow,
  StyledHeader,
  VoteReminder,
} from './GameRecap.style';
import { Pad } from 'redux/Game/types';
import { selectRoom, selectPlayerIsAdmin } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import { FormattedMessage } from 'react-intl';
import { useReviewPad } from 'redux/Game/hooks';
import PadTab from 'components/PadTab';
import TopRightButtons from 'atoms/TopRightButtons';
import TopRightButton from 'atoms/TopRightButton';
import { selectAvailableVoteCount } from 'redux/Game/selectors';
import NewGameModal from 'components/NewGameModal';
import { ThumbUpIcon } from 'components/ReactionOverlay/ReactionOverlay.style';
import { useHistory } from 'react-router';
import { useLeaveRoom } from 'redux/Room/hooks';
import DoneModal from 'components/DoneModal';

const GameRecap: React.FunctionComponent = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const availableVoteCount = useSelector(selectAvailableVoteCount);

  const [displayedPadId, setDisplayedPadId] = useState<string | null>(null);
  const [doneModalIsOpen, setDoneModalIsOpen] = useState<boolean>(true);
  const [newGameModalIsOpen, setNewGameModalIsOpen] = useState<boolean>(false);

  const doReviewPad = useReviewPad();

  const history = useHistory();
  const doLeaveRoom = useLeaveRoom();

  const displayedPad = game?.pads.find(pad => pad.uuid === displayedPadId);

  useEffect(() => {
    if (!game || displayedPad) return;
    setDisplayedPadId(game.pads[0].uuid);
  }, [game, displayedPad]);

  if (!room || !game) return null;

  const selectPad = (pad: Pad) => {
    doReviewPad(pad);
    setDisplayedPadId(pad.uuid);
  };

  const leaveGame = () => {
    doLeaveRoom(room);
    history.push('/');
  };

  return (
    <>
      <OuterRecapContainer>
        <PadTabsRow>
          {game.pads.map(pad => (
            <PadTab
              key={pad.uuid}
              isActive={displayedPadId === pad.uuid}
              onClick={() => selectPad(pad)}
              pad={pad}
            />
          ))}
        </PadTabsRow>
        <GameRecapContainer>{displayedPad && <PadRecap pad={displayedPad} />}</GameRecapContainer>
      </OuterRecapContainer>
      <VoteReminder>
        <FormattedMessage id="recap.availableVotes" />
        {Array(availableVoteCount)
          .fill('')
          .map((_, index) => (
            <ThumbUpIcon key={index} />
          ))}
      </VoteReminder>
      {doneModalIsOpen && <DoneModal onClose={() => setDoneModalIsOpen(false)} />}
      <TopRightButtons>
        <TopRightButton onClick={leaveGame}>
          <FormattedMessage id="voteResults.leaveTeam" />
        </TopRightButton>
        {isPlayerAdmin && (
          <TopRightButton onClick={() => setNewGameModalIsOpen(true)}>
            <FormattedMessage id="voteResults.newGame" />
          </TopRightButton>
        )}
      </TopRightButtons>
      <NewGameModal isOpen={newGameModalIsOpen} onClose={() => setNewGameModalIsOpen(false)} />
    </>
  );
};

export default GameRecap;
