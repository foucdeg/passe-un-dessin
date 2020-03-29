import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createRootReducer from './reducers';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

export const history = createBrowserHistory();

export default function buildStore(preloadedState = {}) {
  const store = configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [
      ...getDefaultMiddleware({
        serializableCheck: {},
      }),
      routerMiddleware(history),
    ],
    reducer: createRootReducer(history),
    preloadedState,
  });

  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then(() => store.replaceReducer(createRootReducer(history)));
    });
  }

  return { store };
}
