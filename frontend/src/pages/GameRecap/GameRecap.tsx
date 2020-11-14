/* eslint-disable react/no-array-index-key */

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'redux/useSelector';
import { Pad } from 'redux/Game/types';
import { selectRoom } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import { FormattedMessage } from 'react-intl';
import { useReviewPad } from 'redux/Game/hooks';
import { selectAvailableVoteCount } from 'redux/Game/selectors';

import { tabHandlerBuilder } from 'services/utils';
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

  const [displayedPadIndex, setDisplayedPadIndex] = useState<number>(0);

  const doReviewPad = useReviewPad();

  const selectPad = useCallback(
    (index: number) => {
      if (!game) return;
      if (!publicMode) {
        doReviewPad(game.pads[index]);
      }
      setDisplayedPadIndex(index);
    },
    [setDisplayedPadIndex, doReviewPad, game, publicMode],
  );

  const selectNextPad = useCallback(() => {
    if (!game) return;
    const maxPadIndex = publicMode ? game.pads.length : game.pads.length - 1;
    if (displayedPadIndex + 1 <= maxPadIndex) {
      selectPad(displayedPadIndex + 1);
    }
  }, [game, publicMode, displayedPadIndex, selectPad]);

  const selectPreviousPad = useCallback(() => {
    if (!game) return;
    if (displayedPadIndex - 1 >= 0) {
      selectPad(displayedPadIndex - 1);
    }
  }, [game, displayedPadIndex, selectPad]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      tabHandlerBuilder(selectNextPad, selectPreviousPad)(event);
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [selectNextPad, selectPreviousPad]);

  if (!game) return null;

  if (!publicMode && !room) return null;

  const displayedPad: Pad | undefined = game.pads[displayedPadIndex];
  const isVoteResultsDisplayed = displayedPad === undefined;

  const selectResults = () => {
    if (!publicMode) return;

    setDisplayedPadIndex(game.pads.length);
  };

  return (
    <>
      <OuterRecapContainer>
        <TopRow>
          <PadTabs>
            {game.pads.map((pad, index) => (
              <PadTab
                publicMode={publicMode}
                key={pad.uuid}
                isActive={index === displayedPadIndex}
                onClick={() => selectPad(index)}
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
                  <ThumbUpButton primary key={index} />
                ))}
            </>
          ) : (
            <FormattedMessage id="recap.noMoreVotes" />
          )}
        </VoteReminder>
      )}
    </>
  );
};

export default GameRecap;
