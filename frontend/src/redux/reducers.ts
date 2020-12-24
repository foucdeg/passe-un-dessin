/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.ts, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';

import { reducer as general } from './General';
import { reducer as room } from './Room';
import { reducer as game } from './Game';
import { reducer as player } from './Player';
import { reducer as step } from './Step';
import { reducer as twitch } from './Twitch';

import { RootState } from './types';

const rootReducer = combineReducers<RootState>({
  general,
  room,
  game,
  player,
  step,
  twitch,
});

export default rootReducer;
