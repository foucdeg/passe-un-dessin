import React, { useState, useEffect } from 'react';

import { useSelector } from 'redux/useSelector';
import Modal from 'components/Modal';
import { useFetchMe, useCreatePlayer } from 'redux/Player/hooks';
import { UsernameForm, StyledField, StyledHeader, VirtualButton } from './UserNameGate.style';
import FieldLabel from 'atoms/FieldLabel';
import { selectPlayer } from 'redux/Player/selectors';
import { FormattedMessage, useIntl } from 'react-intl';
import AuthPanel from 'components/AuthPanel';
import arrowRight from 'assets/arrow-right.svg';

interface Props {
  children: React.ReactNode;
}

const UserNameGate: React.FC<Props> = ({ children }) => {
  const [playerName, setPlayerName] = useState<string>('');
  const intl = useIntl();
  const player = useSelector(selectPlayer);
  const doFetchMe = useFetchMe();
  const doCreatePlayer = useCreatePlayer();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  useEffect(() => {
    doFetchMe();
  }, [doFetchMe]);

  return (
    <>
      {children}
      {player === false && (
        <Modal isOpen>
          <StyledHeader>
            <FormattedMessage id="userNameModal.title" />
          </StyledHeader>
          {isLoggingIn ? (
            <AuthPanel defaultLogIn />
          ) : (
            <>
              <UsernameForm
                onSubmit={(e) => {
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
                  onChange={(e) => setPlayerName(e.target.value)}
                  adornment={
                    <VirtualButton type="submit">
                      <img src={arrowRight} alt="Submit" />
                    </VirtualButton>
                  }
                />
                <p></p>
              </UsernameForm>
              <VirtualButton onClick={() => setIsLoggingIn(true)}>
                <p>
                  <FormattedMessage id="userNameModal.iHaveAnAccount" />
                </p>
              </VirtualButton>
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default UserNameGate;
