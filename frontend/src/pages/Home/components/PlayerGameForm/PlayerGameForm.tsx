import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useCreateRoom } from 'redux/Room/hooks';
import Button from 'atoms/Button';
import TextInput from 'atoms/TextInput';
import { useCreatePlayer } from 'redux/Player/hooks';
import { useSelector } from 'redux/useSelector';
import { selectPlayer } from 'redux/Player/selectors';
import { NoProps } from 'services/utils';
import { StartButton, StyledForm } from './PlayerGameForm.style';

export const PlayerGameForm: React.FC<NoProps> = () => {
  const intl = useIntl();
  const player = useSelector(selectPlayer);
  const [playerName, setPlayerName] = useState<string>('');
  const doCreateRoom = useCreateRoom();
  const doCreatePlayer = useCreatePlayer();

  const doSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await doCreatePlayer(playerName.trim());
    doCreateRoom();
  };

  if (player) {
    return (
      <StartButton onClick={doCreateRoom}>
        <FormattedMessage id="home.startRoom" />
      </StartButton>
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
      />
      <Button type="submit" disabled={!playerName.trim()}>
        <FormattedMessage id="home.startRoom" />
      </Button>
    </StyledForm>
  );
};

export default PlayerGameForm;
