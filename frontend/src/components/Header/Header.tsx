import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { PATHS } from 'routes';
import { Logo, HeaderContainer } from './Header.style';
import AudioControl from 'components/AudioControl';

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <RouterLink to={PATHS.HOME}>
        <Logo>Passe un dessin</Logo>
      </RouterLink>
      <AudioControl />
    </HeaderContainer>
  );
};

export default Header;
