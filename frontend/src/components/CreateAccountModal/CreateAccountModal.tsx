import React from 'react';
import { useSelector } from 'redux/useSelector';
import { selectPlayer } from 'redux/Player/selectors';
import SecondaryButton from 'components/SecondaryButton';
import {
  CreateAccountContainer,
  Column,
  Gutter,
  WideModal,
  Features,
  Feature,
  StyledHeader,
  StyledParagraph,
  SeparatorText,
} from './CreateAccountModal.style';
import LoginWithFacebook from 'components/LogInWithFacebook';
import LoginWithGoogle from 'components/LogInWithGoogle';
import HorizontalSeparator from 'components/HorizontalSeparator';
import Spacer from 'atoms/Spacer';
import { useCreateAccount } from 'redux/Player/hooks';
import ClassicAccountCreationForm from 'components/ClassicAccountCreationForm';
import { FormattedMessage } from 'react-intl';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const player = useSelector(selectPlayer);
  const createAccount = useCreateAccount();

  if (!player) return null;

  return (
    <WideModal isOpen={isOpen} onClose={onClose}>
      <CreateAccountContainer>
        <Column>
          <StyledHeader>
            <FormattedMessage id="createAccountModal.niceGame" values={{ name: player.name }} />
          </StyledHeader>
          <StyledParagraph>
            <FormattedMessage id="createAccountModal.keepHistory" />
          </StyledParagraph>
          <StyledParagraph>
            <FormattedMessage id="createAccountModal.features" />
          </StyledParagraph>
          <Features>
            <Feature>
              <FormattedMessage id="createAccountModal.history" />
            </Feature>
            <Feature>
              <FormattedMessage id="createAccountModal.leaderboard" />
            </Feature>
            <Feature>
              <FormattedMessage id="createAccountModal.safeNickname" />
            </Feature>
            <Feature>
              <FormattedMessage id="createAccountModal.andMore" />
            </Feature>
          </Features>
          <Spacer />
          <SecondaryButton onClick={onClose}>
            <FormattedMessage id="createAccountModal.later" />
          </SecondaryButton>
        </Column>
        <Gutter />
        <Column>
          <LoginWithFacebook />
          <LoginWithGoogle />
          <HorizontalSeparator>
            <SeparatorText>
              <FormattedMessage id="auth.oldStyle" />
            </SeparatorText>
          </HorizontalSeparator>
          <ClassicAccountCreationForm createAccount={createAccount} />
        </Column>
      </CreateAccountContainer>
    </WideModal>
  );
};

export default CreateAccountModal;
