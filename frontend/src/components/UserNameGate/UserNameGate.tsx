import React, { useState, useEffect } from 'react';

import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import Modal from 'components/Modal';
import { useFetchMe, useCreatePlayer } from 'redux/Player/hooks';
import { UsernameForm, StyledField, StyledButton } from './UserNameGate.style';
import ModalTitle from 'atoms/ModalTitle';
import FieldLabel from 'atoms/FieldLabel';

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
      {player === false && (
        <Modal isOpen>
          <ModalTitle>Comment tu t'appelles ?</ModalTitle>
          <UsernameForm
            onSubmit={e => {
              e.preventDefault();
              doCreatePlayer(playerName);
            }}
          >
            <FieldLabel htmlFor="username">Choisis un nom</FieldLabel>
            <StyledField
              id="username"
              type="text"
              autoFocus
              value={playerName}
              placeholder={'XXGamerDu62'}
              onChange={e => setPlayerName(e.target.value)}
            />
            <StyledButton type="submit">Valider</StyledButton>
          </UsernameForm>
        </Modal>
      )}
    </>
  );
};

export default UserNameGate;
