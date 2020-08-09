import React from 'react';
import Modal from 'components/Modal';
import AuthPanel from 'components/AuthPanel';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AuthPanel onDone={onClose} />
    </Modal>
  );
};

export default AuthModal;
