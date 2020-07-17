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
import ClassicLoginForm from 'components/ClassicLoginForm';
import HorizontalSeparator from 'components/HorizontalSeparator';
import Spacer from 'atoms/Spacer';

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
          <StyledHeader>Belle partie, {player.name} !</StyledHeader>
          <StyledParagraph>
            Ce serait dommage de la laisser disparaître dans l'oubli ! Pour garder en mémoire tes
            plus belles créations, il suffit de te créer un compte.
          </StyledParagraph>
          <StyledParagraph>Tu auras ainsi accès aux fonctionnalités suivantes :</StyledParagraph>
          <Features>
            <Feature>Historique de tes parties</Feature>
            <Feature>Leaderboard mondial des meilleurs joueurs</Feature>
            <Feature>Réservation de ton pseudo</Feature>
            <Feature>... et plus à venir !</Feature>
          </Features>
          <Spacer />
          <SecondaryButton onClick={onClose}>Plus tard</SecondaryButton>
        </Column>
        <Gutter />
        <Column>
          <LoginWithFacebook />
          <LoginWithGoogle />
          <HorizontalSeparator>
            <SeparatorText>Ou à l'ancienne :</SeparatorText>
          </HorizontalSeparator>
          <ClassicLoginForm />
        </Column>
      </CreateAccountContainer>
    </WideModal>
  );
};

export default CreateAccountModal;
