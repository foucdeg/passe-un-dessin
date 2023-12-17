import React, { useEffect, useState, ReactNode } from 'react';
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
import { selectPlayerId } from 'redux/Player/selectors';
import { useFetchRoom, useJoinRoom, useLeaveRoom } from 'redux/Room/hooks';
import { selectRoom } from 'redux/Room/selectors';
import { useSelector } from 'redux/useSelector';
import { PUBLIC_PATHS } from 'routes';
import BareLink from 'atoms/BareLink';
import Loader from 'atoms/Loader';
import { useParams } from 'react-router';
import { useRoomEvents } from 'pages/Room/events';
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

const noop = () => {
  /* noop */
};

interface RouteParams {
  roomId: string;
}

const RoomLobby: React.FunctionComponent = () => {
  const doJoinRoom = useJoinRoom();
  const doLeaveRoom = useLeaveRoom();
  const doStartGame = useStartGame();
  const doCheckIfPlayerShouldJoin = useCheckIfPlayerShouldJoin();
  const room = useSelector(selectRoom);
  const playerId = useSelector(selectPlayerId);
  const [inputText, setInputText] = useState<string>(document.location.href);
  const [roundDuration, setRoundDuration] = useRoundDuration();
  const [drawOwnWord, setDrawOwnWord] = useDrawOwnWordSwitch();
  const [controlledReveal, setControlledReveal] = useControlledRevealSwitch();
  const doFetchRoom = useFetchRoom();

  const { roomId } = useParams<keyof RouteParams>() as RouteParams;
  useRoomEvents(roomId, noop, noop);

  const intl = useIntl();

  useEffect(() => {
    if (roomId) {
      doFetchRoom(roomId);
    }
  }, [doFetchRoom, roomId]);

  useEffect(() => {
    if (
      room &&
      playerId &&
      !room.players.some((roomPlayer) => roomPlayer.uuid === playerId) &&
      !window.loginLock
    ) {
      doJoinRoom(room.uuid);
    }
  }, [room, playerId, doJoinRoom]);

  useEffect(() => {
    if (
      room &&
      playerId &&
      room.players.some((roomPlayer) => roomPlayer.uuid === playerId) &&
      room.current_game_id
    ) {
      doCheckIfPlayerShouldJoin(room.current_game_id);
    }
  }, [room, playerId, doCheckIfPlayerShouldJoin]);

  if (!room) {
    return (
      <Modal isOpen>
        <StyledHeader>
          <FormattedMessage id="roomLobby.title" />
        </StyledHeader>
        <Loader />
      </Modal>
    );
  }
  if (!playerId) return null;

  const goodNumberOfPlayers =
    room.players.length >= MIN_PLAYERS && room.players.length <= MAX_PLAYERS;

  const isPlayerAdmin = playerId === room.admin.uuid;

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
      <StyledRoomName>&ldquo;{room.friendly_name}&rdquo;</StyledRoomName>
      <FieldLabel>
        <FormattedMessage
          id="roomLobby.sendLink"
          values={{
            min: MIN_PLAYERS,
            max: MAX_PLAYERS,
            info: (chunks: ReactNode[]) => <Info>{chunks}</Info>,
          }}
        />
      </FieldLabel>
      <StyledField
        data-test="room-link"
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
        {room.players.map((roomPlayer) => (
          <AvatarWithName key={roomPlayer.uuid} data-test="avatar">
            <BareLink
              to={PUBLIC_PATHS.PLAYER_DETAILS.replace(':playerId', roomPlayer.uuid)}
              target="_blank"
              rel="noreferrer"
            >
              <Avatar player={roomPlayer} />
              <PlayerName color={roomPlayer.color}>{roomPlayer.name}</PlayerName>
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
                data-test="start-game"
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

export default RoomLobby;
