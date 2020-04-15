import React, { useState, useEffect } from 'react';

import { useSelector } from 'redux/useSelector';
import Modal from 'components/Modal';
import { useFetchMe, useCreatePlayer } from 'redux/Player/hooks';
import { UsernameForm, StyledField, StyledButton } from './UserNameGate.style';
import FieldLabel from 'atoms/FieldLabel';
import Header2 from 'atoms/Header2';
import { selectPlayer } from 'redux/Player/selectors';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
  children: React.ReactNode;
}

const UserNameGate: React.FC<Props> = ({ children }) => {
  const [playerName, setPlayerName] = useState<string>('');
  const intl = useIntl();
  const player = useSelector(selectPlayer);
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
          <Header2>
            <FormattedMessage id="userNameModal.title" />
          </Header2>
          <UsernameForm
            onSubmit={e => {
              e.preventDefault();
              if (playerName !== '') {
                doCreatePlayer(playerName);
              }
            }}
          >
            <FieldLabel htmlFor="username">
              <FormattedMessage id="userNameModal.pickName" />
            </FieldLabel>
            <StyledField
              id="username"
              type="text"
              autoFocus
              value={playerName}
              placeholder={intl.formatMessage({ id: 'userNameModal.placeholder' })}
              onChange={e => setPlayerName(e.target.value)}
            />
            <StyledButton type="submit">
              <FormattedMessage id="userNameModal.submit" />
            </StyledButton>
          </UsernameForm>
        </Modal>
      )}
    </>
  );
};

export default UserNameGate;
