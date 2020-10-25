import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import reducer from './reducers';

export default function buildStore(preloadedState = {}) {
  const store = configureStore({
    devTools: process.env.REACT_APP_ENV !== 'production',
    middleware: getDefaultMiddleware(),
    reducer,
    preloadedState,
  });

  /* istanbul ignore next */
  if (process.env.REACT_APP_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then(() => store.replaceReducer(reducer));
    });
  }

  return { store };
}
