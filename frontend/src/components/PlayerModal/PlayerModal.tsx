import React, { useEffect, useState } from 'react';
import { useSelector } from 'redux/useSelector';
import {
  WideModal,
  PlayerModalContainer,
  Column,
  StyledHeader,
  InputArrow,
  SeparatorText,
  Gutter,
} from './PlayerModal.style';
import { FormattedMessage } from 'react-intl';
import FieldLabel from 'atoms/FieldLabel';
import TextInput from 'components/TextInput';
import { selectPlayer } from 'redux/Player/selectors';
import { useEditPlayer, useCreateAccount } from 'redux/Player/hooks';
import LoginWithFacebook from 'components/LogInWithFacebook';
import LoginWithGoogle from 'components/LogInWithGoogle';
import HorizontalSeparator from 'components/HorizontalSeparator';
import ClassicAccountCreationForm from 'components/ClassicAccountCreationForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PlayerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const player = useSelector(selectPlayer);
  const [playerName, setPlayerName] = useState<string>('');
  const doEditPlayer = useEditPlayer();
  const createAccount = useCreateAccount();

  useEffect(() => {
    if (player) {
      setPlayerName(player.name);
    }
  }, [player]);

  if (!player) return null;

  const onChooseName = () => {
    doEditPlayer({ ...player, name: playerName });
    onClose();
  };

  return (
    <WideModal isOpen={isOpen} onClose={onClose}>
      <PlayerModalContainer>
        <Column>
          <StyledHeader>
            <FormattedMessage id="playerModal.title" />
          </StyledHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onChooseName();
            }}
          >
            <FieldLabel>
              <FormattedMessage id="playerModal.playerName" />
            </FieldLabel>
            <TextInput
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              adornment={<InputArrow alt="Valider" onClick={onChooseName} />}
            />
          </form>
        </Column>
        <Gutter />
        <Column>
          <StyledHeader>
            <FormattedMessage id="playerModal.account" />
          </StyledHeader>
          <LoginWithFacebook />
          <LoginWithGoogle />
          <HorizontalSeparator>
            <SeparatorText>
              <FormattedMessage id="auth.oldStyle" />
            </SeparatorText>
          </HorizontalSeparator>
          <ClassicAccountCreationForm createAccount={createAccount} />
        </Column>
      </PlayerModalContainer>
    </WideModal>
  );
};

export default PlayerModal;
