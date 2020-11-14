import styled from 'styled-components';
import { colorPalette } from 'stylesheet';

interface ModalContainerProps {
  readonly isOpen: boolean;
}

export const ModalContainer = styled.div<ModalContainerProps>`
  position: fixed;
  z-index: 30;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background: rgba(155, 81, 224, 0.6);
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;

export const ModalContent = styled.div`
  background-color: ${colorPalette.white};
  z-index: 35;
  margin: auto;
  margin-top: 120px;
  width: 512px;
  border-radius: 16px;
  padding: 24px 54px;
  position: relative;
  display: flex;
  flex-direction: column;
`;
