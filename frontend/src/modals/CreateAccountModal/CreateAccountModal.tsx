import React from 'react';
import { useSelector } from 'redux/useSelector';
import { selectPlayer } from 'redux/Player/selectors';
import SecondaryButton from 'atoms/SecondaryButton';
import Spacer from 'atoms/Spacer';
import { FormattedMessage } from 'react-intl';
import AuthPanel from 'components/AuthPanel';
import {
  CreateAccountContainer,
  Column,
  Gutter,
  WideModal,
  Features,
  Feature,
  StyledHeader,
  StyledParagraph,
} from './CreateAccountModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const player = useSelector(selectPlayer);

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
          <AuthPanel />
        </Column>
      </CreateAccountContainer>
    </WideModal>
  );
};

export default CreateAccountModal;
