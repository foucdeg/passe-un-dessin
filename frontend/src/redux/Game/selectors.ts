import { RootState } from 'redux/types';
import { getAvailableVoteCount } from 'services/game.service';

export const selectGame = (state: RootState) => state.game.game;

export const selectGameStructure = (state: RootState) => state.game.gameStructure;

export const selectRemainingPlayers = (state: RootState) => state.game.remainingPlayers;

export const selectSuggestions = (state: RootState) => state.game.suggestions;

export const selectPadViewers = (state: RootState) => state.game.recapViews;

export const selectSelectedPadUuid = (state: RootState) => state.game.selectedPadUuid;

export const selectWinners = (state: RootState) => state.game.winners;

export const selectAvailableVoteCount = (state: RootState) => {
  if (!state.game.game) return 0;
  if (!state.player.player) return 0;

  const playerId = state.player.player.uuid;

  return (
    getAvailableVoteCount(state.game.game) -
    state.game.game.pads.reduce(
      (usedVoteCount, pad) =>
        usedVoteCount +
        pad.steps.reduce(
          (usedVoteCount, step) =>
            usedVoteCount + step.votes.filter((vote) => vote.player_id === playerId).length,
          0,
        ),
      0,
    )
  );
};
