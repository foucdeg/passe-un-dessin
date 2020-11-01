/* eslint-disable react/no-array-index-key */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import { Pad } from 'redux/Game/types';
import { selectRoom } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import { FormattedMessage } from 'react-intl';
import { useReviewPad } from 'redux/Game/hooks';
import { selectAvailableVoteCount } from 'redux/Game/selectors';
import NewGameModal from 'modals/NewGameModal';
import DoneModal from 'modals/DoneModal';

import { ThumbUpButton } from './components/ReactionOverlay/ReactionOverlay.style';
import PadTab from './components/PadTab';

import {
  OuterRecapContainer,
  GameRecapContainer,
  TopRow,
  PadTabs,
  VoteReminder,
} from './GameRecap.style';
import PadRecap from './components/PadRecap';
import RecapTab from './components/RecapTab';
import VoteResultsTab from './components/VoteResultsTab';

interface Props {
  publicMode?: boolean;
}

const GameRecap: React.FunctionComponent<Props> = ({ publicMode }) => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const availableVoteCount = useSelector(selectAvailableVoteCount);

  const [displayedPadId, setDisplayedPadId] = useState<string | null>(null);
  const [isVoteResultsDisplayed, setVoteResultsDisplayed] = useState<boolean>(false);
  const [doneModalIsOpen, setDoneModalIsOpen] = useState<boolean>(true);
  const [newGameModalIsOpen, setNewGameModalIsOpen] = useState<boolean>(false);

  const doReviewPad = useReviewPad();

  const displayedPad = game?.pads.find((pad) => pad.uuid === displayedPadId);

  useEffect(() => {
    if (!game || displayedPad || isVoteResultsDisplayed) return;
    setDisplayedPadId(game.pads[0].uuid);
  }, [game, displayedPad, isVoteResultsDisplayed]);

  if (!game) return null;

  if (!publicMode && !room) return null;

  const selectPad = (pad: Pad) => {
    if (!publicMode) {
      doReviewPad(pad);
    }
    setDisplayedPadId(pad.uuid);
    setVoteResultsDisplayed(false);
  };

  const selectResults = () => {
    if (!publicMode) return;

    setDisplayedPadId(null);
    setVoteResultsDisplayed(true);
  };

  return (
    <>
      <OuterRecapContainer>
        <TopRow>
          <PadTabs>
            {game.pads.map((pad) => (
              <PadTab
                publicMode={publicMode}
                key={pad.uuid}
                isActive={displayedPadId === pad.uuid}
                onClick={() => selectPad(pad)}
                pad={pad}
              />
            ))}
            {publicMode && <RecapTab isActive={isVoteResultsDisplayed} onClick={selectResults} />}
          </PadTabs>
        </TopRow>
        <GameRecapContainer>
          {displayedPad && <PadRecap pad={displayedPad} publicMode={publicMode} />}
          {publicMode && isVoteResultsDisplayed && <VoteResultsTab />}
        </GameRecapContainer>
      </OuterRecapContainer>
      {!publicMode && (
        <VoteReminder>
          {availableVoteCount ? (
            <>
              <FormattedMessage id="recap.availableVotes" />
              {Array(availableVoteCount)
                .fill('')
                .map((_, index) => (
                  <ThumbUpButton key={index} />
                ))}
            </>
          ) : (
            <FormattedMessage id="recap.noMoreVotes" />
          )}
        </VoteReminder>
      )}
      {doneModalIsOpen && !publicMode && <DoneModal onClose={() => setDoneModalIsOpen(false)} />}
      <NewGameModal
        isOpen={!publicMode && newGameModalIsOpen}
        onClose={() => setNewGameModalIsOpen(false)}
      />
    </>
  );
};

export default GameRecap;
