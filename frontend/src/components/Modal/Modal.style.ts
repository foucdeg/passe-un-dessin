import styled from 'styled-components';

interface ModalContainerProps {
  readonly isOpen: boolean;
}

export const ModalContainer = styled.div<ModalContainerProps>`
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: rgba(220, 220, 220, 0.8);
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

export const ModalContent = styled.div`
  background-color: #ffffff;
  margin: 233px auto;
  width: 678px;
  height: 401px;
  border-radius: 4px;
  padding: 32px;
  text-align: center;
  line-height: 150%;
  color: $primary-blue;
  position: relative;
`;
