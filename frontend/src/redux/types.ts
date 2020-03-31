import { RoomState } from './Room';
import { GameState } from './Game';
import { PlayerState } from './Player';

export type RootState = Readonly<{
  room: RoomState;
  game: GameState;
  player: PlayerState;
}>;
