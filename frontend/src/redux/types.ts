import { GeneralState } from './General';
import { RoomState } from './Room';
import { GameState } from './Game';
import { PlayerState } from './Player';
import { StepState } from './Step';

export type RootState = Readonly<{
  general: GeneralState;
  room: RoomState;
  game: GameState;
  player: PlayerState;
  step: StepState;
}>;
