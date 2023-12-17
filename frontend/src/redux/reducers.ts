/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.ts, reducers wouldn't be hot reloadable.
 */

import { reducer as room } from './Room';
import { reducer as game } from './Game';
import { reducer as player } from './Player';
import { reducer as step } from './Step';

const rootReducer = {
  room,
  game,
  player,
  step,
};

export default rootReducer;
