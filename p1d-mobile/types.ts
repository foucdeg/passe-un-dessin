/* eslint-disable camelcase */
export interface User {
  email: string;
}

export interface Player {
  name: string;
  uuid: string;
  color: string;
  user?: null | User;
  avatar_url: string | null;
  avatar?: string | null;
  total_score: number;
  rank?: number;
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
