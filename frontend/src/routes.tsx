import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router';
import Loader from 'atoms/Loader';

const Home = lazy(() => import('./pages/Home'));
const Room = lazy(() => import('./pages/Room'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const PasswordReset = lazy(() => import('pages/PasswordReset'));
const PasswordResetRequest = lazy(() => import('pages/PasswordResetRequest'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));

const PlayerDetails = lazy(() => import('./pages/PlayerDetails'));
const GameReview = lazy(() => import('./pages/GameReview'));

export const PLAYER_PATHS = {
  ROOM: '/room/:roomId',
};

export const PUBLIC_PATHS = {
  HOME: '/',
  TERMS_AND_CONDITIONS: '/terms-and-conditions',
  PRIVACY_POLICY: '/privacy-policy',
  LEADERBOARD: '/leaderboard',
  PASSWORD_RESET: '/password-reset',
  PASSWORD_RESET_REQUEST: '/password-reset/request',
  PLAYER_DETAILS: '/player/:playerId',
  GAME_REVIEW: '/game/:gameId',
};

const routes = () => (
  <Suspense fallback={<Loader />}>
    <Route path={[PUBLIC_PATHS.HOME, PLAYER_PATHS.ROOM]} exact component={Home} />
    <Route path={PLAYER_PATHS.ROOM} component={Room} />
    <Route path={PUBLIC_PATHS.TERMS_AND_CONDITIONS} component={TermsAndConditions} />
    <Route path={PUBLIC_PATHS.PRIVACY_POLICY} component={PrivacyPolicy} />
    <Route path={PUBLIC_PATHS.PASSWORD_RESET} exact component={PasswordReset} />
    <Route path={PUBLIC_PATHS.PASSWORD_RESET_REQUEST} exact component={PasswordResetRequest} />
    <Route path={PUBLIC_PATHS.LEADERBOARD} component={Leaderboard} />
    <Route path={PUBLIC_PATHS.PLAYER_DETAILS} component={PlayerDetails} />
    <Route path={PUBLIC_PATHS.GAME_REVIEW} component={GameReview} />
  </Suspense>
);

export default routes;
