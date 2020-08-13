import React, { useEffect } from 'react';

import { useSelector } from 'redux/useSelector';
import { useFetchMe } from 'redux/Player/hooks';
import { selectPlayer } from 'redux/Player/selectors';
import UserNameModal from 'modals/UserNameModal';
import { useLocation } from 'react-router';
import { PUBLIC_PATHS } from 'routes';

interface Props {
  children: React.ReactNode;
}

const UserNameGate: React.FC<Props> = ({ children }) => {
  const player = useSelector(selectPlayer);
  const doFetchMe = useFetchMe();
  const location = useLocation();

  useEffect(() => {
    if (!player) {
      doFetchMe();
    }
  }, [player, doFetchMe]);

  return (
    <>
      {children}
      {player === false && !Object.values(PUBLIC_PATHS).includes(location.pathname) && (
        <UserNameModal />
      )}
    </>
  );
};

export default UserNameGate;
