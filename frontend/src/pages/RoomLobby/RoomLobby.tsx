import React, { useEffect } from 'react';
import { RoomContainer } from './RoomLobby.style';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import { useJoinRoom } from 'redux/Room/hooks';
import { MIN_PLAYERS, MAX_PLAYERS } from 'redux/Game/constants';
import { useStartGame } from 'redux/Game/hooks';

const Room: React.FunctionComponent = () => {
  const [, doJoinRoom] = useJoinRoom();
  const [, doStartGame] = useStartGame();
  const room = useSelector((state: RootState) => state.room.room);
  const player = useSelector((state: RootState) => state.player.player);

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

  return (
    <RoomContainer>
      <p>Bienvenue sur la room {room.uuid} !</p>
      <p>Joueurs :</p>
      <ul>
        {room.players.map(player => (
          <li key={player.uuid}>{player.name}</li>
        ))}
      </ul>
      {goodNumberOfPlayers && isPlayerAdmin && (
        <button onClick={() => doStartGame(room.uuid)}>Start Game</button>
      )}
    </RoomContainer>
  );
};

export default Room;
