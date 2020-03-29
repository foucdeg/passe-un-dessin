import React from 'react';

import { ModalContainer, ModalContent } from './Modal.style';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ isOpen, onClose, children }) => {
  return (
    <ModalContainer isOpen={isOpen} onClick={onClose}>
      <ModalContent>{children}</ModalContent>
    </ModalContainer>
  );
};

export default Modal;
