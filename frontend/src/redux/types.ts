import { RoomState } from './Room';
import { GameState } from './Game';
import { PlayerState } from './Player';
import { StepState } from './Step';
import { GameRecapState } from './GameRecap';

export type RootState = Readonly<{
  room: RoomState;
  game: GameState;
  player: PlayerState;
  step: StepState;
  gameRecap: GameRecapState;
}>;
