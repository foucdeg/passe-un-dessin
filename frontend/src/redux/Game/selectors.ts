import { RootState } from 'redux/types';

export const selectGame = (state: RootState) => state.game.game;

export const selectRemainingPlayers = (state: RootState) => state.game.remainingPlayers;

export const selectSuggestions = (state: RootState) => state.game.suggestions;

export const selectWinners = (state: RootState) => state.game.winners;
