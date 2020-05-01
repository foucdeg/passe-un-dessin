import { Player } from 'redux/Player/types';

export interface Room {
  players: Player[];
  admin: Player;
  uuid: string;
  current_game_id: string;
}

export interface PlayerRanking {
  player: Player;
  vote_count: number;
}

export type RoomRanking = PlayerRanking[];
