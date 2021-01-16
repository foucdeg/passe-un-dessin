import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { addPlayerToRoom, removePlayerFromRoom, nameNewAdmin } from 'redux/Room';
import { resetGameMetadata } from 'redux/Game/slice';
import { resetStep } from 'redux/Step/slice';
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
  REVEAL_STARTS = 'REVEAL_STARTS',
  DEBRIEF_STARTS = 'DEBRIEF_STARTS',
}

interface RoomEvent {
  message_type: ROOM_EVENT_TYPE;
}

type PlayerConnectedEvent = RoomEvent & {
  message_type: ROOM_EVENT_TYPE.PLAYER_CONNECTED;
  player: Player;
};
const isPlayerConnectedEvent = (event: RoomEvent): event is PlayerConnectedEvent =>
  event.message_type === ROOM_EVENT_TYPE.PLAYER_CONNECTED;

type PlayerLeftEvent = RoomEvent & {
  message_type: ROOM_EVENT_TYPE.PLAYER_LEFT;
  player: Player;
  needs_new_admin: boolean;
};
const isPlayerLeftEvent = (event: RoomEvent): event is PlayerLeftEvent =>
  event.message_type === ROOM_EVENT_TYPE.PLAYER_LEFT;

type PlayerReplacedEvent = RoomEvent & {
  message_type: ROOM_EVENT_TYPE.PLAYER_REPLACED;
  old_player: Player;
  new_player: Player;
};
const isPlayerReplacedEvent = (event: RoomEvent): event is PlayerReplacedEvent =>
  event.message_type === ROOM_EVENT_TYPE.PLAYER_REPLACED;

type NewAdminEvent = RoomEvent & {
  message_type: ROOM_EVENT_TYPE.NEW_ADMIN;
  player: Player;
};
const isNewAdminEvent = (event: RoomEvent): event is NewAdminEvent =>
  event.message_type === ROOM_EVENT_TYPE.NEW_ADMIN;

type GameStartsEvent = RoomEvent & {
  message_type: ROOM_EVENT_TYPE.GAME_STARTS;
  game: Game;
};
const isGameStartsEvent = (event: RoomEvent): event is GameStartsEvent =>
  event.message_type === ROOM_EVENT_TYPE.GAME_STARTS;

type GameRecapStartsEvent = RoomEvent & {
  message_type: ROOM_EVENT_TYPE.DEBRIEF_STARTS;
  game: Game;
};
const isGameRecapStartsEvent = (event: RoomEvent): event is GameRecapStartsEvent =>
  event.message_type === ROOM_EVENT_TYPE.DEBRIEF_STARTS;

type RevealStartsEvent = RoomEvent & {
  message_type: ROOM_EVENT_TYPE.REVEAL_STARTS;
  game: Game;
};
const isRevealStartsEvent = (event: RoomEvent): event is RevealStartsEvent =>
  event.message_type === ROOM_EVENT_TYPE.DEBRIEF_STARTS;

export const useRoomEvents = (
  roomId: string,
  setPlayerWhoLeft: (player: Player) => void,
  setAdminChanged: (adminChanged: boolean) => void,
) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const player = useSelector(selectPlayer);

  const onRoomEvent = useCallback(
    (event: RoomEvent) => {
      if (isPlayerConnectedEvent(event)) {
        dispatch(addPlayerToRoom(event.player));
        return;
      }
      if (isPlayerLeftEvent(event)) {
        if (player && event.player.uuid === player.uuid) {
          push('/');
          return;
        }
        setPlayerWhoLeft(event.player);
        setAdminChanged(event.needs_new_admin);
        dispatch(removePlayerFromRoom(event.player));
        return;
      }
      if (isPlayerReplacedEvent(event)) {
        dispatch(addPlayerToRoom(event.new_player));
        dispatch(removePlayerFromRoom(event.old_player));
        return;
      }
      if (isNewAdminEvent(event)) {
        dispatch(nameNewAdmin(event.player));
        return;
      }
      if (isGameStartsEvent(event)) {
        dispatch(resetStep());
        dispatch(resetGameMetadata());
        push(`/room/${roomId}/game/${event.game.uuid}`);
        return;
      }
      if (isGameRecapStartsEvent(event) || isRevealStartsEvent(event)) {
        push(`/room/${roomId}/game/${event.game.uuid}/recap`);
        return;
      }
    },
    [dispatch, push, player, roomId, setPlayerWhoLeft, setAdminChanged],
  );

  useServerSentEvent<RoomEvent>(`room-${roomId}`, onRoomEvent);
};
