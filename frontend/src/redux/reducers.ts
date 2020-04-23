/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.ts, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';

import { reducer as room } from './Room';
import { reducer as game } from './Game';
import { reducer as player } from './Player';
import { reducer as step } from './Step';
import { reducer as gameRecap } from './GameRecap';
import { RootState } from './types';

const rootReducer = combineReducers<RootState>({
  room,
  game,
  player,
  step,
  gameRecap,
});

export default rootReducer;
