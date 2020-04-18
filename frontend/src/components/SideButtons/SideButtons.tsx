import React, { useState } from 'react';
import { useSelector } from 'redux/useSelector';
import { selectPlayerIsAdmin, selectRoom } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import AudioControl from 'components/AudioControl';
import { SideButtonsContainer, AdminModalButton, RefreshButton } from './SideButtons.style';
import AdminModal from 'components/AdminModal';
import { useRefreshGame } from 'redux/Game/hooks';
import IconAndTooltip from 'components/IconAndTooltip';
import { useIntl } from 'react-intl';

const SideButtons: React.FC<{}> = () => {
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const [isAdminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const intl = useIntl();

  const doRefreshGame = useRefreshGame();

  return (
    <SideButtonsContainer>
      <AudioControl />
      {room && isPlayerAdmin && (
        <IconAndTooltip tooltipText={intl.formatMessage({ id: 'menu.adminMenu' })}>
          <AdminModalButton alt="Settings" onClick={() => setAdminModalOpen(true)} />
        </IconAndTooltip>
      )}
      {game && (
        <IconAndTooltip tooltipText={intl.formatMessage({ id: 'menu.refresh' })}>
          <RefreshButton alt="refresh" onClick={doRefreshGame} />
        </IconAndTooltip>
      )}
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </SideButtonsContainer>
  );
};

export default SideButtons;
