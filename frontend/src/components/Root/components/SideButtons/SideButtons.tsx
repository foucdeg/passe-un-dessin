import React, { useState } from 'react';
import copy from 'copy-to-clipboard';

import { useSelector } from 'redux/useSelector';
import { selectPlayerIsAdmin, selectRoom } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import AdminModal from 'modals/AdminModal';
import { useRefreshGame } from 'redux/Game/hooks';
import IconAndTooltip from 'atoms/IconAndTooltip';
import { useIntl } from 'react-intl';
import { selectPlayer } from 'redux/Player/selectors';
import PlayerModal from 'modals/PlayerModal';
import RankingModal from 'modals/RankingModal';
import { useLeaveRoom } from 'redux/Room/hooks';
import { EmptyObject, useBoolean } from 'services/utils';
import AuthModal from 'modals/AuthModal';
import {
  SideButtonsContainer,
  UserModalButton,
  PlayerModalButton,
  AdminModalButton,
  PlayerAddButton,
  RefreshButton,
  LeaveButton,
  RankingModalButton,
} from './SideButtons.style';

const SideButtons: React.FC<EmptyObject> = () => {
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const player = useSelector(selectPlayer);

  const intl = useIntl();
  const [invitePlayerButtonText, setInvitePlayerButtonText] = useState<string>(
    intl.formatMessage({ id: 'menu.addPlayer' }),
  );

  const [isAdminModalOpen, openAdminModal, closeAdminModal] = useBoolean(false);
  const [isAuthModalOpen, openAuthModal, closeAuthModal] = useBoolean(false);
  const [isPlayerModalOpen, openPlayerModal, closePlayerModal] = useBoolean(false);
  const [isRankingModalOpen, openRankingModal, closeRankingModal] = useBoolean(false);

  const onCopy = () => {
    if (!room) return;

    const roomUrl = `${window.location.origin}/room/${room.uuid}`;
    copy(roomUrl);

    setInvitePlayerButtonText(intl.formatMessage({ id: 'menu.addPlayerLinkCopied' }));
    setTimeout(() => {
      setInvitePlayerButtonText(intl.formatMessage({ id: 'menu.addPlayer' }));
    }, 5000);
  };

  const [{ loading }, doRefreshGame] = useRefreshGame();
  const doLeaveRoom = useLeaveRoom();

  return (
    <SideButtonsContainer>
      {player && player.user ? (
        <IconAndTooltip tooltipText={intl.formatMessage({ id: 'menu.accountMenu' })}>
          <UserModalButton alt="User" onClick={openPlayerModal} />
        </IconAndTooltip>
      ) : (
        <IconAndTooltip tooltipText={intl.formatMessage({ id: 'menu.playerMenu' })}>
          <PlayerModalButton alt="Player" onClick={openAuthModal} />
        </IconAndTooltip>
      )}
      {room && isPlayerAdmin && (
        <IconAndTooltip tooltipText={intl.formatMessage({ id: 'menu.adminMenu' })}>
          <AdminModalButton alt="Settings" onClick={openAdminModal} />
        </IconAndTooltip>
      )}
      {room && (
        <IconAndTooltip tooltipText={intl.formatMessage({ id: 'menu.ranking' })}>
          <RankingModalButton alt="Ranking" onClick={openRankingModal} />
        </IconAndTooltip>
      )}
      {game && (
        <IconAndTooltip tooltipText={invitePlayerButtonText}>
          <PlayerAddButton alt="Add player" onClick={onCopy} />
        </IconAndTooltip>
      )}
      {game && (
        <IconAndTooltip tooltipText={intl.formatMessage({ id: 'menu.refresh' })}>
          <RefreshButton alt="refresh" onClick={doRefreshGame} $isLoading={loading} />
        </IconAndTooltip>
      )}
      {room && (
        <IconAndTooltip tooltipText={intl.formatMessage({ id: 'menu.leaveTeam' })}>
          <LeaveButton alt="leave game" onClick={doLeaveRoom} />
        </IconAndTooltip>
      )}
      <AdminModal isOpen={isAdminModalOpen} onClose={closeAdminModal} />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      <PlayerModal isOpen={isPlayerModalOpen} onClose={closePlayerModal} />
      <RankingModal isOpen={isRankingModalOpen} onClose={closeRankingModal} />
    </SideButtonsContainer>
  );
};

export default SideButtons;
