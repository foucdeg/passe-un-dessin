/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.ts, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { reducer as room } from './Room';
import { reducer as game } from './Game';
import { reducer as player } from './Player';
import { RootState } from './types';
import { History } from 'history';

const createRootReducer = (history: History) =>
  combineReducers<RootState>({
    room,
    game,
    player,
    router: connectRouter(history),
  });

export default createRootReducer;
