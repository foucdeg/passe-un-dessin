import { RoomState } from './Room';
import { GameState } from './Game';
import { PlayerState } from './Player';
import { RouterState } from 'connected-react-router';

export type RootState = Readonly<{
  room: RoomState;
  game: GameState;
  player: PlayerState;
  router: RouterState;
}>;
