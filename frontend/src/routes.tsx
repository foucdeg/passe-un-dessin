import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router';
import Loader from 'atoms/Loader';

const Home = lazy(() => import('./pages/Home'));
const Room = lazy(() => import('./pages/Room'));
const Legal = lazy(() => import('./pages/Legal'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const PlayerDetails = lazy(() => import('./pages/PlayerDetails'));

export const PLAYER_PATHS = {
  ROOM: '/room/:roomId',
};

export const PUBLIC_PATHS = {
  HOME: '/',
  LEGAL: '/legal',
  LEADERBOARD: '/leaderboard',
  PLAYER_DETAILS: '/player/:playerId',
};

const routes = () => (
  <Suspense fallback={<Loader />}>
    <Route path={[PUBLIC_PATHS.HOME, PLAYER_PATHS.ROOM]} exact component={Home} />
    <Route path={PLAYER_PATHS.ROOM} component={Room} />
    <Route path={PUBLIC_PATHS.LEGAL} component={Legal} />
    <Route path={PUBLIC_PATHS.LEADERBOARD} component={Leaderboard} />
    <Route path={PUBLIC_PATHS.PLAYER_DETAILS} component={PlayerDetails} />
  </Suspense>
);

export default routes;
