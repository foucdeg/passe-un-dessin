import React, { useState } from 'react';
import { useSelector } from 'redux/useSelector';
import { selectPlayerIsAdmin, selectRoom } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import AudioControl from 'components/AudioControl';
import {
  SideButtonsContainer,
  PlayerModalButton,
  AdminModalButton,
  RefreshButton,
  RankingModalButton,
} from './SideButtons.style';
import AdminModal from 'components/AdminModal';
import { useRefreshGame } from 'redux/Game/hooks';
import IconAndTooltip from 'components/IconAndTooltip';
import { useIntl } from 'react-intl';
import { selectPlayer } from 'redux/Player/selectors';
import PlayerModal from 'components/PlayerModal';
import RankingModal from 'components/RankingModal';

const SideButtons: React.FC<{}> = () => {
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const player = useSelector(selectPlayer);

  const [isAdminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [isPlayerModalOpen, setPlayerModalOpen] = useState<boolean>(false);
  const [isRankingModalOpen, setRankingModalOpen] = useState<boolean>(false);

  const intl = useIntl();

  const [{ loading }, doRefreshGame] = useRefreshGame();

  return (
    <SideButtonsContainer>
      <AudioControl />
      {player && (
        <IconAndTooltip tooltipText={intl.formatMessage({ id: 'menu.playerMenu' })}>
          <PlayerModalButton alt="Player" onClick={() => setPlayerModalOpen(true)} />
        </IconAndTooltip>
      )}
      {room && isPlayerAdmin && (
        <IconAndTooltip tooltipText={intl.formatMessage({ id: 'menu.adminMenu' })}>
          <AdminModalButton alt="Settings" onClick={() => setAdminModalOpen(true)} />
        </IconAndTooltip>
      )}
      {room && (
        <IconAndTooltip tooltipText={intl.formatMessage({ id: 'menu.ranking' })}>
          <RankingModalButton alt="Ranking" onClick={() => setRankingModalOpen(true)} />
        </IconAndTooltip>
      )}
      {game && (
        <IconAndTooltip tooltipText={intl.formatMessage({ id: 'menu.refresh' })}>
          <RefreshButton alt="refresh" onClick={doRefreshGame} isLoading={loading} />
        </IconAndTooltip>
      )}
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setAdminModalOpen(false)} />
      <PlayerModal isOpen={isPlayerModalOpen} onClose={() => setPlayerModalOpen(false)} />
      <RankingModal isOpen={isRankingModalOpen} onClose={() => setRankingModalOpen(false)} />
    </SideButtonsContainer>
  );
};

export default SideButtons;
