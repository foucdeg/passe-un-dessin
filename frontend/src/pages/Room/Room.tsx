import React, { useEffect } from 'react';
import { RoomContainer } from './Room.style';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import { useFetchRoom, useJoinRoom } from 'redux/Room/hooks';
import { useParams } from 'react-router';

const Room: React.FunctionComponent = () => {
  const { roomId } = useParams();
  const [, doFetchRoom] = useFetchRoom();
  const [, doJoinRoom] = useJoinRoom();
  const room = useSelector((state: RootState) => state.room.room);
  const player = useSelector((state: RootState) => state.player.player);

  useEffect(() => {
    doFetchRoom(roomId);
  }, [doFetchRoom, roomId]);

  useEffect(() => {
    if (room && player && !room.players.some(roomPlayer => roomPlayer.uuid === player.uuid)) {
      doJoinRoom(room.uuid);
    }
  }, [room, player, doJoinRoom]);

  useEffect(() => {
    if (room) {
      const eventSource: EventSource = new EventSource(`/events/?channel=room-${room.uuid}`);
      eventSource.onmessage = (event: MessageEvent) => console.log(event);

      return () => {
        eventSource.close();
      };
    }
  }, [room]);

  if (!room) return null;

  return (
    <RoomContainer>
      <p>Bienvenue sur la room {room.uuid} !</p>
      <p>Joueurs :</p>
      <ul>
        {room.players.map(player => (
          <li key={player.uuid}>{player.name}</li>
        ))}
      </ul>
    </RoomContainer>
  );
};

export default Room;
