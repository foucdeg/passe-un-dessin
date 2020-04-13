import React, { useState } from 'react';
import { useSelector } from 'redux/useSelector';
import { selectPlayerIsAdmin, selectRoom } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import AudioControl from 'components/AudioControl';
import { SideButtonsContainer, AdminModalButton, RefreshButton } from './SideButtons.style';
import cogIcon from 'assets/cog.svg';
import refreshIcon from 'assets/refresh.svg';
import AdminModal from 'components/AdminModal';
import { useRefreshGame } from 'redux/Game/hooks';
import IconAndTooltip from 'components/IconAndTooltip';

const SideButtons: React.FC<{}> = () => {
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const [isAdminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  const doRefreshGame = useRefreshGame();

  return (
    <SideButtonsContainer>
      <AudioControl />
      {room && isPlayerAdmin && (
        <IconAndTooltip tooltipText="Actions d'administration">
          <AdminModalButton src={cogIcon} alt="Settings" onClick={() => setAdminModalOpen(true)} />
        </IconAndTooltip>
      )}
      {game && (
        <IconAndTooltip tooltipText="Resynchroniser">
          <RefreshButton src={refreshIcon} alt="refresh" onClick={doRefreshGame} />
        </IconAndTooltip>
      )}
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </SideButtonsContainer>
  );
};

export default SideButtons;
