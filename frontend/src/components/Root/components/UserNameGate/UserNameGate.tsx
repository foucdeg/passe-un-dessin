import React, { useEffect } from 'react';

import { useSelector } from 'redux/useSelector';
import { useFetchMe } from 'redux/Player/hooks';
import { selectPlayer } from 'redux/Player/selectors';
import UserNameModal from 'modals/UserNameModal';

interface Props {
  children: React.ReactNode;
}

const UserNameGate: React.FC<Props> = ({ children }) => {
  const player = useSelector(selectPlayer);
  const doFetchMe = useFetchMe();

  useEffect(() => {
    doFetchMe();
  }, [doFetchMe]);

  return (
    <>
      {children}
      {player === false && <UserNameModal />}
    </>
  );
};

export default UserNameGate;
