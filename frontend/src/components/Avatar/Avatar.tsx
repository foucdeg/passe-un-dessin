import React from 'react';
import { Player } from 'redux/Player/types';
import defaultAvatar from 'assets/default-avatar/default-avatar.png';
import { Container, StyledDrawing, StyledEditIcon } from './Avatar.style';

interface Props {
  player: Player;
  onClick?: () => void;
  className?: string;
  editOnHover?: boolean;
}

const Avatar: React.FC<Props> = ({ player, onClick, className, editOnHover }) => {
  return (
    <Container onClick={onClick} className={className}>
      <StyledDrawing src={player.avatar_url || defaultAvatar} />
      {editOnHover && <StyledEditIcon />}
    </Container>
  );
};

export default Avatar;
