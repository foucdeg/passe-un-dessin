import React from 'react';
import { Player } from 'redux/Player/types';
import { Container, StyledDrawing } from './Avatar.style';

interface Props {
  player: Player;
  onAvatarClick: () => void;
}

const Avatar: React.FC<Props> = ({ player, onAvatarClick }) => {
  return (
    <Container onClick={onAvatarClick}>
      <StyledDrawing src={player.avatar_url} />
    </Container>
  );
};

export default Avatar;
