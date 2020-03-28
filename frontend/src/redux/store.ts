import { persistStore, persistReducer, PERSIST } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from './reducers';

export default function buildStore(preloadedState = {}) {
  const persistConfig = {
    key: 'root',
    whitelist: ['login'],
    storage,
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    middleware: getDefaultMiddleware({
      serializableCheck: {
        // see https://github.com/rt2zz/redux-persist/issues/988#issuecomment-529575333 to ignore actions for serializable check
        ignoredActions: [PERSIST],
      },
    }),
    reducer: persistedReducer,
    preloadedState,
  });

  const persistor = persistStore(store);

  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then(() => store.replaceReducer(persistedReducer));
    });
  }

  return { store, persistor };
}
