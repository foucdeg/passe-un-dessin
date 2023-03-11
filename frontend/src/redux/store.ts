import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducers';

export default function buildStore(preloadedState = {}) {
  const store = configureStore({
    devTools: import.meta.env.VITE_ENV !== 'production',
    reducer,
    preloadedState,
  });

  return { store };
}
