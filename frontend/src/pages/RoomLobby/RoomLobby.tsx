import React, { useEffect, useState } from 'react';
import FieldLabel from 'atoms/FieldLabel';
import Button from 'atoms/Button';
import Modal from 'components/Modal';
import Avatar from 'components/Avatar';
import copy from 'copy-to-clipboard';
import { FormattedMessage, useIntl } from 'react-intl';
import { MAX_PLAYERS, MIN_PLAYERS } from 'redux/Game/constants';
import {
  useCheckIfPlayerShouldJoin,
  useControlledRevealSwitch,
  useDrawOwnWordSwitch,
  useRoundDuration,
  useStartGame,
} from 'redux/Game/hooks';
import { selectPlayer } from 'redux/Player/selectors';
import { useJoinRoom, useLeaveRoom } from 'redux/Room/hooks';
import { selectRoom } from 'redux/Room/selectors';
import { useSelector } from 'redux/useSelector';
import { PUBLIC_PATHS } from 'routes';
import BareLink from 'atoms/BareLink';
import RoundDurationPicker from './components/RoundDurationPicker';
import DrawOwnWordSwitch from './components/DrawOwnWordSwitch';
import {
  ButtonRow,
  CloseButton,
  CopyLinkAdornment,
  HelpText,
  Info,
  StyledField,
  StyledHeader,
  StyledRoomName,
  PlayerName,
  PlayerList,
  AvatarWithName,
} from './RoomLobby.style';
import ControlledRevealSwitch from './components/ControlledRevealSwitch';

const Room: React.FunctionComponent = () => {
  const doJoinRoom = useJoinRoom();
  const doLeaveRoom = useLeaveRoom();
  const doStartGame = useStartGame();
  const doCheckIfPlayerShouldJoin = useCheckIfPlayerShouldJoin();
  const room = useSelector(selectRoom);
  const player = useSelector(selectPlayer);
  const [inputText, setInputText] = useState<string>(document.location.href);
  const [roundDuration, setRoundDuration] = useRoundDuration();
  const [drawOwnWord, setDrawOwnWord] = useDrawOwnWordSwitch();
  const [controlledReveal, setControlledReveal] = useControlledRevealSwitch();

  const intl = useIntl();

  useEffect(() => {
    if (
      room &&
      player &&
      !room.players.some((roomPlayer) => roomPlayer.uuid === player.uuid) &&
      !window.loginLock
    ) {
      doJoinRoom(room.uuid);
    }
  }, [room, player, doJoinRoom]);

  useEffect(() => {
    if (
      room &&
      player &&
      room.players.some((roomPlayer) => roomPlayer.uuid === player.uuid) &&
      room.current_game_id
    ) {
      doCheckIfPlayerShouldJoin(room.current_game_id);
    }
  }, [room, player, doCheckIfPlayerShouldJoin]);

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

  return (
    <Modal isOpen>
      <CloseButton onClick={doLeaveRoom} />
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
          <DrawOwnWordSwitch
            playerCount={room.players.length}
            drawOwnWord={drawOwnWord}
            setDrawOwnWord={setDrawOwnWord}
          />
          <ControlledRevealSwitch
            controlledReveal={controlledReveal}
            setControlledReveal={setControlledReveal}
          />
        </>
      )}
      <PlayerList>
        {room.players.map((player) => (
          <AvatarWithName key={player.uuid}>
            <BareLink
              to={PUBLIC_PATHS.PLAYER_DETAILS.replace(':playerId', player.uuid)}
              target="_blank"
              rel="noreferrer"
            >
              <Avatar player={player} />
              <PlayerName color={player.color}>{player.name}</PlayerName>
            </BareLink>
          </AvatarWithName>
        ))}
      </PlayerList>

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
              <Button
                onClick={() => doStartGame(room.uuid, roundDuration, drawOwnWord, controlledReveal)}
              >
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
