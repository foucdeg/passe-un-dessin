import styled from 'styled-components';
import fullBackground from 'assets/full-background.svg';

const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  background: url(${fullBackground});
  background-size: cover;
  padding: 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export default GameContainer;
