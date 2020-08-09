import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router';
import Loader from 'atoms/Loader';

const Home = lazy(() => import('./pages/Home'));
const Room = lazy(() => import('./pages/Room'));
const Legal = lazy(() => import('./pages/Legal'));

export const PATHS = {
  HOME: '/',
  ROOM: '/room/:roomId',
  GAME: '/game/:gameId',
  LEGAL: '/legal',
};

const routes = () => (
  <Suspense fallback={<Loader />}>
    <Route path={PATHS.HOME} component={Home} />
    <Route path={PATHS.ROOM} component={Room} />
    <Route path={PATHS.LEGAL} component={Legal} />
  </Suspense>
);

export default routes;
