import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router';
import Loader from './components/Loader/Loader';

const Home = lazy(() => import('./pages/Home'));
const Room = lazy(() => import('./pages/Room'));

export const PATHS = {
  HOME: '/',
  ROOM: '/room/:roomId',
  GAME: '/game/:gameId',
};

const routes = () => (
  <Suspense fallback={<Loader />}>
    <Route path={PATHS.HOME} component={Home} />
    <Route path={PATHS.ROOM} component={Room} />
  </Suspense>
);

export default routes;
