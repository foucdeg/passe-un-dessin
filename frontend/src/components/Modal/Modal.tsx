import React from 'react';

import { ModalContainer, ModalContent } from './Modal.style';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<Props> = ({ isOpen, onClose, children, className }) => {
  return (
    <ModalContainer isOpen={isOpen} onClick={onClose}>
      <ModalContent className={className} onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContent>
    </ModalContainer>
  );
};

export default Modal;
