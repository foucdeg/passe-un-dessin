import { Player } from 'redux/Player/types';

export enum GamePhase {
  INIT = 'INIT',
  ROUNDS = 'ROUNDS',
  DEBRIEF = 'DEBRIEF',
}

export enum StepType {
  WORD_TO_DRAWING = 'WORD_TO_DRAWING',
  DRAWING_TO_WORD = 'DRAWING_TO_WORD',
}

export interface PadStep {
  uuid: string;
  step_type: StepType;
  round_number: number;
  player: Player;

  sentence: string;
  drawing: string;
}

export interface Pad {
  uuid: string;
  initial_player: Player;
  steps: PadStep[];
  order: number;
  sentence: string;
}

export interface Game {
  uuid: string;
  players: Player[];
  pads: Pad[];
  rounds: PadStep[];
  phase: GamePhase;
  current_round: number | null;
}
