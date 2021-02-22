import React from 'react';

import { ModalContainer, ModalContent } from './Modal.style';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  'data-test'?: string;
}

const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  children,
  className,
  'data-test': dataTestAttr,
}) => {
  return (
    <ModalContainer isOpen={isOpen} onClick={onClose}>
      {isOpen && (
        <ModalContent
          className={className}
          onClick={(e) => e.stopPropagation()}
          data-test={dataTestAttr}
        >
          {children}
        </ModalContent>
      )}
    </ModalContainer>
  );
};

export default Modal;
