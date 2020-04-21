import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, Pad, GamePhase, PadStep } from './types';
import { Player } from 'redux/Player/types';

export type GameState = Readonly<{
  game: Game | null;
  remainingPlayers: Player[];
  suggestions: string[];
}>;

const initialState: GameState = { game: null, remainingPlayers: [], suggestions: [] } as GameState;

const gameSlice = createSlice({
  name: 'Game',
  initialState,
  reducers: {
    updateGame: (state, action: PayloadAction<Game | null>) => {
      state.game = action.payload;
      state.remainingPlayers = state.game?.players || [];
    },
    updatePad: (state, action: PayloadAction<Pad>) => {
      if (!state.game) return;

      const matchingPadIndex = state.game?.pads.findIndex(pad => pad.uuid === action.payload.uuid);

      state.game.pads[matchingPadIndex] = action.payload;
    },
    updatePadStep: (state, action: PayloadAction<PadStep>) => {
      if (!state.game) return;

      const matchingPadIndex = state.game?.pads.findIndex(pad =>
        pad.steps.find(step => step.uuid === action.payload.uuid),
      );
      if (matchingPadIndex === undefined) return;

      const matchingPadStepIndex = state.game?.pads[matchingPadIndex].steps.findIndex(
        step => step.uuid === action.payload.uuid,
      );

      state.game.pads[matchingPadIndex].steps[matchingPadStepIndex] = action.payload;
    },
    startRound: (state, action: PayloadAction<{ roundNumber?: number }>) => {
      if (!state.game) return;

      state.game.phase = GamePhase.ROUNDS;
      state.game.current_round = action.payload.roundNumber || 0;
      state.remainingPlayers = state.game.players;
    },
    startDebrief: (state, action: PayloadAction<{}>) => {
      if (!state.game) return;

      state.game.phase = GamePhase.DEBRIEF;
      state.game.current_round = null;
    },
    markPlayerFinished: (state, action: PayloadAction<Player>) => {
      state.remainingPlayers = state.remainingPlayers.filter(
        remPlayer => remPlayer.uuid !== action.payload.uuid,
      );
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },
  },
});

export const {
  updateGame,
  updatePad,
  startRound,
  startDebrief,
  markPlayerFinished,
  setSuggestions,
  updatePadStep,
} = gameSlice.actions;
export default gameSlice.reducer;
