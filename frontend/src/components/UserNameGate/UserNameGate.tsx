import React, { useState, useEffect } from 'react';

import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import Modal from 'components/Modal';
import { useFetchMe, useCreatePlayer } from 'redux/Player/hooks';
import TextInput from 'components/TextInput';

interface Props {
  children: React.ReactNode;
}

const UserNameGate: React.FC<Props> = ({ children }) => {
  const player = useSelector((state: RootState) => state.player.player);
  const [playerName, setPlayerName] = useState<string>('');
  const [, doFetchMe] = useFetchMe();
  const [, doCreatePlayer] = useCreatePlayer();

  useEffect(() => {
    doFetchMe();
  }, [doFetchMe]);

  return (
    <>
      {children}
      {!player && (
        <Modal isOpen>
          <h2>Coucou toi !</h2>
          <p>C'est quoi ton petit nom ?</p>
          <form
            onSubmit={e => {
              e.preventDefault();
              doCreatePlayer(playerName);
            }}
          >
            <TextInput
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
            />
            <input type="submit" value="Valider " />
          </form>
        </Modal>
      )}
    </>
  );
};

export default UserNameGate;
