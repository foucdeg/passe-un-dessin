import { GamePlayerParticipation } from 'redux/Game/types';

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
}

export interface GameWithParticipants {
  uuid: string;
  created_at: string;
  participants: GamePlayerParticipation[];
}

export interface Participation {
  game: GameWithParticipants | null;
}

export type PlayerWithParticipations = Player & {
  participations: Participation[];
  created_at: string;
};
