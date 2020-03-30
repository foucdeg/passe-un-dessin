import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import Loader from './components/Loader/Loader';
import Game from './pages/Game';

const Home = lazy(() => import('./pages/Home'));
const Room = lazy(() => import('./pages/Room'));

export const PATHS = {
  HOME: '/',
  ROOM: '/room/:roomId',
  GAME: '/game/:gameId',
};

const routes = () => (
  <Suspense fallback={<Loader />}>
    <Switch>
      <Route exact path={PATHS.HOME} component={Home} />
      <Route path={PATHS.ROOM} component={Room} />
      <Route path={PATHS.GAME} component={Game} />
    </Switch>
  </Suspense>
);

export default routes;
