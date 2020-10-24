import styled from 'styled-components';
import homeIcon from 'assets/home.svg';

const HomeButton = styled.img.attrs({ src: homeIcon })`
  position: absolute;
  left: 24px;
  top: 24px;
  cursor: pointer;
`;
HomeButton.displayName = 'HomeButton';

export default HomeButton;
