import { Player } from 'redux/Player/types';

export enum GamePhase {
  ROUNDS = 'ROUNDS',
  DEBRIEF = 'DEBRIEF',
  VOTE_RESULTS = 'VOTE_RESULTS',
}

export enum StepType {
  INITIAL = 'INITIAL',
  WORD_TO_DRAWING = 'WORD_TO_DRAWING',
  DRAWING_TO_WORD = 'DRAWING_TO_WORD',
}

export interface Vote {
  player_id: string;
}

export interface PadStep {
  uuid: string;
  step_type: StepType;
  round_number: number;
  player: Player;

  sentence: string | null;
  drawing_url: string;
  votes: Vote[];
  created_at: string;
}

export interface Pad {
  uuid: string;
  steps: PadStep[];
  order: number;
}

export interface GamePlayerParticipation {
  player: Player;
  order: number;
}

export interface RawGame {
  uuid: string;
  participants: GamePlayerParticipation[];
  pads: Pad[];
  rounds: PadStep[];
  phase: GamePhase;
  current_round: number;
  round_duration: number;
  draw_own_word: boolean;
}

export type Game = RawGame & {
  players: Player[];
};
