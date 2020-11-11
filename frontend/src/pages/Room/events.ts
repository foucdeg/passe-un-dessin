import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { addPlayerToRoom, removePlayerFromRoom, nameNewAdmin } from 'redux/Room';
import { resetGameMetadata } from 'redux/Game/slice';
import { useSelector } from 'redux/useSelector';
import { selectPlayer } from 'redux/Player/selectors';
import { useServerSentEvent } from 'services/networking/server-events';
import { Player } from 'redux/Player/types';
import { Game } from 'redux/Game/types';

enum ROOM_EVENT_TYPE {
  PLAYER_CONNECTED = 'PLAYER_CONNECTED',
  PLAYER_LEFT = 'PLAYER_LEFT',
  PLAYER_REPLACED = 'PLAYER_REPLACED',
  NEW_ADMIN = 'NEW_ADMIN',
  GAME_STARTS = 'GAME_STARTS',
}

interface BaseMessage {
  message_type: ROOM_EVENT_TYPE;
}

type PlayerConnectedMessage = BaseMessage & {
  message_type: ROOM_EVENT_TYPE.PLAYER_CONNECTED;
  player: Player;
};
const isPlayerConnectedMessage = (message: BaseMessage): message is PlayerConnectedMessage =>
  message.message_type === ROOM_EVENT_TYPE.PLAYER_CONNECTED;

type PlayerLeftMessage = BaseMessage & {
  message_type: ROOM_EVENT_TYPE.PLAYER_LEFT;
  player: Player;
  needs_new_admin: boolean;
};
const isPlayerLeftMessage = (message: BaseMessage): message is PlayerLeftMessage =>
  message.message_type === ROOM_EVENT_TYPE.PLAYER_LEFT;

type PlayerReplacedMessage = BaseMessage & {
  message_type: ROOM_EVENT_TYPE.PLAYER_REPLACED;
  old_player: Player;
  new_player: Player;
};
const isPlayerReplacedMessage = (message: BaseMessage): message is PlayerReplacedMessage =>
  message.message_type === ROOM_EVENT_TYPE.PLAYER_REPLACED;

type NewAdminMessage = BaseMessage & {
  message_type: ROOM_EVENT_TYPE.NEW_ADMIN;
  player: Player;
};
const isNewAdminMessage = (message: BaseMessage): message is NewAdminMessage =>
  message.message_type === ROOM_EVENT_TYPE.NEW_ADMIN;

type GameStartsMessage = BaseMessage & {
  message_type: ROOM_EVENT_TYPE.GAME_STARTS;
  game: Game;
};
const isGameStartsMessage = (message: BaseMessage): message is GameStartsMessage =>
  message.message_type === ROOM_EVENT_TYPE.GAME_STARTS;

export const useRoomEvents = (
  roomId: string,
  setPlayerWhoLeft: (player: Player) => void,
  setAdminChanged: (adminChanged: boolean) => void,
) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const player = useSelector(selectPlayer);

  const onRoomEvent = useCallback(
    (message: BaseMessage) => {
      if (isPlayerConnectedMessage(message)) {
        dispatch(addPlayerToRoom(message.player));
        return;
      }
      if (isPlayerLeftMessage(message)) {
        if (player && message.player.uuid === player.uuid) {
          push('/');
          return;
        }
        setPlayerWhoLeft(message.player);
        setAdminChanged(message.needs_new_admin);
        dispatch(removePlayerFromRoom(message.player));
        return;
      }
      if (isPlayerReplacedMessage(message)) {
        dispatch(addPlayerToRoom(message.new_player));
        dispatch(removePlayerFromRoom(message.old_player));
        return;
      }
      if (isNewAdminMessage(message)) {
        dispatch(nameNewAdmin(message.player));
        return;
      }
      if (isGameStartsMessage(message)) {
        dispatch(resetGameMetadata());
        push(`/room/${roomId}/game/${message.game.uuid}`);
        return;
      }
    },
    [dispatch, push, player, roomId, setPlayerWhoLeft, setAdminChanged],
  );

  const channelName = `room-${roomId}`;

  useServerSentEvent<BaseMessage>(channelName, onRoomEvent);
};
