import React, { useEffect } from 'react';

import { useSelector } from 'redux/useSelector';
import { useFetchMe } from 'redux/Player/hooks';
import { selectPlayerId } from 'redux/Player/selectors';
import UserNameModal from 'modals/UserNameModal';
import { useRouteMatch } from 'react-router';
import { PLAYER_PATHS } from 'routes';

interface Props {
  children: React.ReactNode;
}

const UserNameGate: React.FC<Props> = ({ children }) => {
  const playerId = useSelector(selectPlayerId);
  const [, doFetchMe] = useFetchMe();
  const match = useRouteMatch(PLAYER_PATHS.ROOM);

  useEffect(() => {
    if (!playerId) {
      doFetchMe();
    }
  }, [playerId, doFetchMe]);

  return (
    <>
      {children}
      {playerId === false && match && <UserNameModal />}
    </>
  );
};

export default UserNameGate;
