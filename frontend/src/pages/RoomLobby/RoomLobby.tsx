import React, { useEffect, useState } from 'react';
import { useSelector } from 'redux/useSelector';
import copy from 'copy-to-clipboard';

import { useJoinRoom, useLeaveRoom } from 'redux/Room/hooks';
import { MIN_PLAYERS, MAX_PLAYERS } from 'redux/Game/constants';
import { useStartGame } from 'redux/Game/hooks';
import { useHistory } from 'react-router';
import Modal from 'components/Modal';
import FieldLabel from 'atoms/FieldLabel';
import {
  Info,
  StyledField,
  ButtonRow,
  HelpText,
  StyledHeader,
  CopyLinkAdornment,
} from './RoomLobby.style';
import Button from 'components/Button';
import PlayerChips from 'atoms/PlayerChips';
import PlayerChip from 'atoms/PlayerChip';

import linkIcon from 'assets/link.svg';
import { selectPlayer } from 'redux/Player/selectors';
import { selectRoom } from 'redux/Room/selectors';
import { FormattedMessage, useIntl } from 'react-intl';

const Room: React.FunctionComponent = () => {
  const doJoinRoom = useJoinRoom();
  const doLeaveRoom = useLeaveRoom();
  const doStartGame = useStartGame();
  const room = useSelector(selectRoom);
  const player = useSelector(selectPlayer);
  const history = useHistory();
  const [inputText, setInputText] = useState<string>(document.location.href);
  const intl = useIntl();

  useEffect(() => {
    if (room && player && !room.players.some(roomPlayer => roomPlayer.uuid === player.uuid)) {
      doJoinRoom(room.uuid);
    }
  }, [room, player, doJoinRoom]);

  if (!room) return null;
  if (!player) return null;

  const goodNumberOfPlayers =
    room.players.length >= MIN_PLAYERS && room.players.length <= MAX_PLAYERS;

  const isPlayerAdmin = player.uuid === room.admin.uuid;

  const onCopy = () => {
    copy(document.location.href);
    setInputText(intl.formatMessage({ id: 'roomLobby.copiedLink' }));
    setTimeout(() => {
      setInputText(document.location.href);
    }, 5000);
  };

  const onLeave = () => {
    doLeaveRoom(room);
    history.push('/');
  };

  return (
    <Modal isOpen onClose={onLeave}>
      <StyledHeader>
        <FormattedMessage id="roomLobby.startRoom" />
      </StyledHeader>
      <FieldLabel>
        <FormattedMessage
          id="roomLobby.sendLink"
          values={{
            min: MIN_PLAYERS,
            max: MAX_PLAYERS,
            info: (...chunks: string[]) => <Info>{chunks}</Info>,
          }}
        />
      </FieldLabel>
      <StyledField
        readOnly
        value={inputText}
        adornment={<CopyLinkAdornment src={linkIcon} onClick={onCopy} alt="Click to copy" />}
      />
      <FieldLabel>
        <FormattedMessage id="roomLobby.players" />
      </FieldLabel>
      <PlayerChips>
        {room.players.map(player => (
          <PlayerChip key={player.uuid} color={player.color}>
            {player.name}
          </PlayerChip>
        ))}
      </PlayerChips>

      <ButtonRow>
        {!goodNumberOfPlayers && (
          <HelpText>
            <FormattedMessage
              id="roomLobby.needMore"
              values={{ count: MIN_PLAYERS - room.players.length }}
            />
          </HelpText>
        )}
        {goodNumberOfPlayers &&
          (isPlayerAdmin ? (
            <>
              <HelpText>
                <FormattedMessage id="roomLobby.isEveryoneThere" />
              </HelpText>
              <Button onClick={() => doStartGame(room.uuid)}>
                <FormattedMessage id="roomLobby.play" />
              </Button>
            </>
          ) : (
            <HelpText>
              <FormattedMessage id="roomLobby.adminWillStart" values={{ name: room.admin.name }} />
            </HelpText>
          ))}
      </ButtonRow>
    </Modal>
  );
};

export default Room;
