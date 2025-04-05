/* eslint-disable react/no-array-index-key */

import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'redux/useSelector';
import { Game, GamePhase, Pad } from 'redux/Game/types';
import { selectPlayerIsAdmin } from 'redux/Room/selectors';
import { selectSelectedPadUuid, selectAvailableVoteCount } from 'redux/Game/selectors';
import { FormattedMessage } from 'react-intl';
import { useForceState, useReviewPad } from 'redux/Game/hooks';

import { tabHandlerBuilder } from 'services/utils';
import { selectPlayerId } from 'redux/Player/selectors';
import Loader from 'atoms/Loader';
import { useDispatch } from 'react-redux';
import { setSelectedPadUuid } from 'redux/Game';
import { Room } from 'redux/Room/types';
import { ThumbUpButton } from './components/ReactionOverlay/ReactionOverlay.style';
import PadTab from './components/PadTab';

import {
  OuterRecapContainer,
  TopRow,
  PadTabs,
  VoteReminder,
  StartVotingPhase,
  StaticTab,
} from './GameRecap.style';
import PadRecap from './components/PadRecap';
import RecapTab from './components/RecapTab';
import VoteResultsTab from './components/VoteResultsTab';

interface Props {
  room?: Room;
  game: Game;
  publicMode?: boolean;
}

const getSelectedPadIndex = (game: Game, selectedPadUuid: string | null): number =>
  game.pads.findIndex(({ uuid }) => uuid === selectedPadUuid);

const GameRecap: React.FunctionComponent<Props> = ({ room = null, game, publicMode = false }) => {
  const dispatch = useDispatch();
  const [, doForceState] = useForceState();
  const playerId = useSelector(selectPlayerId);
  const availableVoteCount = useSelector(selectAvailableVoteCount);
  const isAdmin = useSelector(selectPlayerIsAdmin);
  const selectedPadUuid = useSelector(selectSelectedPadUuid);

  const doReviewPad = useReviewPad();

  const setSelectedPad = useCallback(
    (padUuid: string) => {
      if (!game) return;
      if (game.phase === GamePhase.REVEAL && !isAdmin) return;
      if (!publicMode) {
        doReviewPad(game.pads.find(({ uuid }) => uuid === padUuid) as Pad);
      }
      dispatch(setSelectedPadUuid(padUuid));
    },
    [dispatch, doReviewPad, game, publicMode, isAdmin],
  );

  const selectNextPad = useCallback(() => {
    if (!game) return;
    const maxPadIndex = publicMode ? game.pads.length : game.pads.length - 1;
    const displayedPadIndex = getSelectedPadIndex(game, selectedPadUuid);
    if (displayedPadIndex + 1 <= maxPadIndex) {
      setSelectedPad(game.pads[displayedPadIndex + 1].uuid);
    }
  }, [game, publicMode, setSelectedPad, selectedPadUuid]);

  const selectPreviousPad = useCallback(() => {
    if (!game) return;
    const displayedPadIndex = getSelectedPadIndex(game, selectedPadUuid);
    if (displayedPadIndex - 1 >= 0) {
      setSelectedPad(game.pads[displayedPadIndex - 1].uuid);
    }
  }, [game, setSelectedPad, selectedPadUuid]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      tabHandlerBuilder(selectNextPad, selectPreviousPad)(event);
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [selectNextPad, selectPreviousPad]);

  const loadingView = (
    <OuterRecapContainer>
      <Loader />
    </OuterRecapContainer>
  );

  if (!game) return loadingView;

  if (!publicMode && !room) return loadingView;

  if (![GamePhase.REVEAL, GamePhase.DEBRIEF, GamePhase.VOTE_RESULTS].includes(game.phase))
    return loadingView;

  const displayedPad: Pad | undefined = game.pads.find(({ uuid }) => uuid === selectedPadUuid);
  const padIndex = getSelectedPadIndex(game, selectedPadUuid);
  const isVoteResultsDisplayed = displayedPad === undefined;
  const isPlayerInGame =
    !!playerId && !!game.players.find((gamePlayer) => gamePlayer.uuid === playerId);

  const selectResults = () => {
    if (!publicMode) return;

    setSelectedPad('');
  };

  const isDebriefPhase = game.phase === GamePhase.DEBRIEF;
  const canChangeTabs = isAdmin || isDebriefPhase || publicMode;

  return (
    <>
      <OuterRecapContainer>
        <TopRow>
          <PadTabs>
            {canChangeTabs &&
              game.pads.map((pad) => (
                <PadTab
                  publicMode={publicMode}
                  key={pad.uuid}
                  isActive={pad.uuid === selectedPadUuid}
                  onClick={() => canChangeTabs && setSelectedPad(pad.uuid)}
                  pad={pad}
                  isDebriefPhase={isDebriefPhase}
                />
              ))}
            {publicMode && <RecapTab isActive={isVoteResultsDisplayed} onClick={selectResults} />}
            {!canChangeTabs && (
              <StaticTab>
                <FormattedMessage
                  id="recap.lockedReveal"
                  values={{ total: game.pads.length, current: padIndex + 1 }}
                />
              </StaticTab>
            )}
          </PadTabs>
          <div>
            {isAdmin && !isDebriefPhase && (
              <StartVotingPhase
                onClick={() => {
                  doForceState();
                }}
                data-test="start-voting"
              >
                <FormattedMessage id="recap.startVotingPhase" />
              </StartVotingPhase>
            )}
          </div>
        </TopRow>
        {displayedPad && (
          <PadRecap
            pad={displayedPad}
            publicMode={publicMode}
            isPlayerInGame={isPlayerInGame}
            isDebriefPhase={isDebriefPhase}
          />
        )}
        {publicMode && isVoteResultsDisplayed && <VoteResultsTab game={game} />}
      </OuterRecapContainer>
      {!publicMode && isPlayerInGame && isDebriefPhase && (
        <VoteReminder>
          {availableVoteCount ? (
            <>
              <FormattedMessage id="recap.availableVotes" />
              {Array(availableVoteCount)
                .fill('')
                .map((_, index) => (
                  <ThumbUpButton primary key={index} data-test="remaining-votes" />
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
