import React, { useEffect, useState } from 'react';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
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

const Room: React.FunctionComponent = () => {
  const [, doJoinRoom] = useJoinRoom();
  const [, doLeaveRoom] = useLeaveRoom();
  const [, doStartGame] = useStartGame();
  const room = useSelector((state: RootState) => state.room.room);
  const player = useSelector((state: RootState) => state.player.player);
  const history = useHistory();
  const [inputText, setInputText] = useState<string>(document.location.href);

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
    setInputText('Texte copié !');
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
      <StyledHeader>Lancer une partie</StyledHeader>
      <FieldLabel>
        Envoyez ce lien aux participants{' '}
        <Info>
          ({MIN_PLAYERS} à {MAX_PLAYERS} joueurs)
        </Info>
      </FieldLabel>
      <StyledField
        readOnly
        value={inputText}
        adornment={<CopyLinkAdornment src={linkIcon} onClick={onCopy} alt="Click to copy" />}
      />
      <FieldLabel>Participants ayant rejoint la partie :</FieldLabel>
      <PlayerChips>
        {room.players.map(player => (
          <PlayerChip key={player.uuid} color={player.color}>
            {player.name}
          </PlayerChip>
        ))}
      </PlayerChips>

      <ButtonRow>
        {!goodNumberOfPlayers && (
          <HelpText>Il manque encore {MIN_PLAYERS - room.players.length} joueurs !</HelpText>
        )}
        {goodNumberOfPlayers &&
          (isPlayerAdmin ? (
            <>
              <HelpText>Tout le monde est là ?</HelpText>
              <Button onClick={() => doStartGame(room.uuid, history)}>Jouer</Button>
            </>
          ) : (
            <HelpText>C'est à {room.admin.name} de lancer la partie !</HelpText>
          ))}
      </ButtonRow>
    </Modal>
  );
};

export default Room;
