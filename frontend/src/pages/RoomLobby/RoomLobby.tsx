import React, { useEffect, useState } from 'react';
import FieldLabel from 'atoms/FieldLabel';
import PlayerChip from 'atoms/PlayerChip';
import PlayerChips from 'atoms/PlayerChips';
import Button from 'components/Button';
import DrawOwnWordSwitch from 'components/DrawOwnWordSwitch';
import Modal from 'components/Modal';
import RoundDurationPicker from 'components/RoundDurationPicker';
import copy from 'copy-to-clipboard';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { MAX_PLAYERS, MIN_PLAYERS } from 'redux/Game/constants';
import {
  useCheckIfPlayerIsInGame,
  useDrawOwnWordSwitch,
  useRoundDuration,
  useStartGame,
} from 'redux/Game/hooks';
import { selectPlayer } from 'redux/Player/selectors';
import { useJoinRoom, useLeaveRoom } from 'redux/Room/hooks';
import { selectRoom } from 'redux/Room/selectors';
import { useSelector } from 'redux/useSelector';
import { shouldDisplayDrawOwnWordSwitch } from 'services/game.service';
import {
  ButtonRow,
  CloseButton,
  CopyLinkAdornment,
  HelpText,
  Info,
  StyledField,
  StyledHeader,
  StyledRoomName,
} from './RoomLobby.style';

const Room: React.FunctionComponent = () => {
  const doJoinRoom = useJoinRoom();
  const doLeaveRoom = useLeaveRoom();
  const doStartGame = useStartGame();
  const doCheckIfPlayerIsInGame = useCheckIfPlayerIsInGame();
  const room = useSelector(selectRoom);
  const player = useSelector(selectPlayer);
  const history = useHistory();
  const [inputText, setInputText] = useState<string>(document.location.href);
  const [roundDuration, setRoundDuration] = useRoundDuration();
  const [drawOwnWord, setDrawOwnWord] = useDrawOwnWordSwitch();

  const intl = useIntl();

  useEffect(() => {
    if (room && player && !room.players.some(roomPlayer => roomPlayer.uuid === player.uuid)) {
      doJoinRoom(room.uuid);
    }
  }, [room, player, doJoinRoom]);

  useEffect(() => {
    if (
      room &&
      player &&
      room.players.some(roomPlayer => roomPlayer.uuid === player.uuid) &&
      room.current_game_id
    ) {
      doCheckIfPlayerIsInGame(room.current_game_id);
    }
  }, [room, player, doCheckIfPlayerIsInGame]);

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
    <Modal isOpen>
      <CloseButton onClick={onLeave} />
      <StyledHeader>
        <FormattedMessage id="roomLobby.title" />
      </StyledHeader>
      <StyledRoomName>{room.friendly_name}</StyledRoomName>
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
        adornment={<CopyLinkAdornment onClick={onCopy} alt="Click to copy" />}
      />
      {isPlayerAdmin && (
        <>
          <RoundDurationPicker duration={roundDuration} onDurationChange={setRoundDuration} />
          {shouldDisplayDrawOwnWordSwitch(room.players.length) && (
            <DrawOwnWordSwitch drawOwnWord={drawOwnWord} setDrawOwnWord={setDrawOwnWord} />
          )}
        </>
      )}
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
        {room.current_game_id && (
          <HelpText>
            <FormattedMessage id="roomLobby.inGame" />
          </HelpText>
        )}
        {!room.current_game_id && !goodNumberOfPlayers && (
          <HelpText>
            <FormattedMessage
              id="roomLobby.needMore"
              values={{ count: MIN_PLAYERS - room.players.length }}
            />
          </HelpText>
        )}
        {!room.current_game_id &&
          goodNumberOfPlayers &&
          (isPlayerAdmin ? (
            <>
              <HelpText>
                <FormattedMessage id="roomLobby.isEveryoneThere" />
              </HelpText>
              <Button onClick={() => doStartGame(room.uuid, roundDuration, drawOwnWord)}>
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
