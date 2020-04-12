import React, { useState, useEffect } from 'react';

import { useSelector } from 'redux/useSelector';
import Modal from 'components/Modal';
import { useFetchMe, useCreatePlayer } from 'redux/Player/hooks';
import { UsernameForm, StyledField, StyledButton } from './UserNameGate.style';
import FieldLabel from 'atoms/FieldLabel';
import Header2 from 'atoms/Header2';
import { selectPlayer } from 'redux/Player/selectors';

interface Props {
  children: React.ReactNode;
}

const UserNameGate: React.FC<Props> = ({ children }) => {
  const player = useSelector(selectPlayer);
  const [playerName, setPlayerName] = useState<string>('');
  const doFetchMe = useFetchMe();
  const doCreatePlayer = useCreatePlayer();

  useEffect(() => {
    doFetchMe();
  }, [doFetchMe]);

  return (
    <>
      {children}
      {player === false && (
        <Modal isOpen>
          <Header2>Comment tu t'appelles ?</Header2>
          <UsernameForm
            onSubmit={e => {
              e.preventDefault();
              if (playerName !== '') {
                doCreatePlayer(playerName);
              }
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
