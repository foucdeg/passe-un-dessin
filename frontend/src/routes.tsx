import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Loader from 'atoms/Loader';

const Home = lazy(() => import('./pages/Home'));
const RoomLobby = lazy(() => import('./pages/RoomLobby'));
const Room = lazy(() => import('./pages/Room'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const PasswordReset = lazy(() => import('pages/PasswordReset'));
const PasswordResetRequest = lazy(() => import('pages/PasswordResetRequest'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));

const PlayerDetails = lazy(() => import('./pages/PlayerDetails'));
const GameReview = lazy(() => import('./pages/GameReview'));

export const PLAYER_PATHS = {
  ROOM: '/room/:roomId/',
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

const AppRoutes: React.FunctionComponent = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path={PUBLIC_PATHS.HOME} element={<Home />} />
      <Route path={PLAYER_PATHS.ROOM}>
        <Route
          index
          element={
            <>
              <Home />
              <RoomLobby />
            </>
          }
        />
        <Route path="*" element={<Room />} />
      </Route>
      <Route path={PUBLIC_PATHS.TERMS_AND_CONDITIONS} element={<TermsAndConditions />} />
      <Route path={PUBLIC_PATHS.PRIVACY_POLICY} element={<PrivacyPolicy />} />
      <Route path={PUBLIC_PATHS.PASSWORD_RESET} element={<PasswordReset />} />
      <Route path={PUBLIC_PATHS.PASSWORD_RESET_REQUEST} element={<PasswordResetRequest />} />
      <Route path={PUBLIC_PATHS.LEADERBOARD} element={<Leaderboard />} />
      <Route path={PUBLIC_PATHS.PLAYER_DETAILS} element={<PlayerDetails />} />
      <Route path={PUBLIC_PATHS.GAME_REVIEW} element={<GameReview />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
