import React, { useState } from 'react';
import { NoProps, useBoolean } from 'services/utils';
import Modal from 'components/Modal';
import { FormattedMessage, useIntl } from 'react-intl';
import FieldLabel from 'atoms/FieldLabel';
import AuthPanel from 'components/AuthPanel';
import { useCreatePlayer } from 'redux/Player/hooks';
import arrowRight from 'assets/arrow-right.svg';
import { StyledHeader, UsernameForm, StyledField, VirtualButton } from './UserNameModal.style';

const UserNameModal: React.FC<NoProps> = () => {
  const [playerName, setPlayerName] = useState<string>('');
  const intl = useIntl();
  const doCreatePlayer = useCreatePlayer();
  const [isLoggingIn, activateLoggingIn] = useBoolean(false);

  return (
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
                doCreatePlayer(playerName.trim());
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
              maxLength={30}
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
          <VirtualButton onClick={activateLoggingIn}>
            <p>
              <FormattedMessage id="userNameModal.iHaveAnAccount" />
            </p>
          </VirtualButton>
        </>
      )}
    </Modal>
  );
};

export default UserNameModal;
