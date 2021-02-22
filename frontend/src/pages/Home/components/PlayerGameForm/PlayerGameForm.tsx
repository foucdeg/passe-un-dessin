import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useCreateRoom } from 'redux/Room/hooks';
import TextInput from 'atoms/TextInput';
import { useCreatePlayer } from 'redux/Player/hooks';
import { useSelector } from 'redux/useSelector';
import { selectPlayerId } from 'redux/Player/selectors';
import { NoProps, useBoolean } from 'services/utils';
import InputArrow from 'atoms/InputArrow';
import { StyledForm, StyledButton } from './PlayerGameForm.style';

export const PlayerGameForm: React.FC<NoProps> = () => {
  const intl = useIntl();
  const playerId = useSelector(selectPlayerId);
  const [playerName, setPlayerName] = useState<string>('');
  const doCreateRoom = useCreateRoom();
  const doCreatePlayer = useCreatePlayer();
  const [isCreatingPlayer, activatePlayerCreation] = useBoolean(false);

  const doSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLImageElement>,
  ) => {
    e.preventDefault();
    await doCreatePlayer(playerName.trim());
    doCreateRoom();
  };

  if (playerId) {
    return (
      <StyledButton onClick={doCreateRoom}>
        <FormattedMessage id="home.startRoom" data-test="start-room" />
      </StyledButton>
    );
  }

  if (!isCreatingPlayer) {
    return (
      <StyledButton onClick={activatePlayerCreation} data-test="start-room">
        <FormattedMessage id="home.startRoom" />
      </StyledButton>
    );
  }

  return (
    <StyledForm onSubmit={doSubmit}>
      <TextInput
        name="player_name"
        value={playerName}
        maxLength={30}
        autoFocus
        placeholder={intl.formatMessage({ id: 'userNameModal.pickName' })}
        onChange={(e) => setPlayerName(e.target.value)}
        adornment={!!playerName.trim() && <InputArrow alt="Valider" onClick={doSubmit} />}
      />
    </StyledForm>
  );
};

export default PlayerGameForm;
