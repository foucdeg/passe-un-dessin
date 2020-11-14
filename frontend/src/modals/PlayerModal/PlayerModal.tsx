import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'redux/useSelector';
import { FormattedMessage } from 'react-intl';
import { selectPlayer, selectPlayerTotalScore, selectPlayerRanking } from 'redux/Player/selectors';
import { useLogout, useFetchMyTotalScore, useEditPlayer } from 'redux/Player/hooks';
import Header4 from 'atoms/Header4';
import CanvasDraw from 'components/Canvas/CanvasDraw';
import SecondaryButton from 'atoms/SecondaryButton';
import { colorPalette } from 'stylesheet';
import { PUBLIC_PATHS } from 'routes';
import { useBoolean } from 'services/utils';
import ScoreCard from './components/ScoreCard';
import PlayerForm from './components/PlayerForm';
import {
  StyledHeader,
  HeaderSection,
  ButtonRow,
  ScoreCardRow,
  StyledSeparator,
  UndoAction,
  StyledModal,
} from './PlayerModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PlayerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const player = useSelector(selectPlayer);
  const doLogout = useLogout();
  const [{ loading: scoreLoading }, fetchMyTotalScore] = useFetchMyTotalScore();
  const totalScore = useSelector(selectPlayerTotalScore);
  const ranking = useSelector(selectPlayerRanking);
  const [isAvatarDrawing, openAvatarDrawing, closeAvatarDrawing] = useBoolean(false);
  const doEditPlayer = useEditPlayer();

  const doSaveAvatar = useCallback(
    async (values: { drawing: string }) => {
      if (!player) return;
      await doEditPlayer({ ...player, avatar: values.drawing });
      closeAvatarDrawing();
    },
    [closeAvatarDrawing, doEditPlayer, player],
  );

  useEffect(() => {
    if (isOpen) {
      fetchMyTotalScore();
    }
  }, [fetchMyTotalScore, isOpen]);

  const logoutAndClose = () => {
    onClose();
    doLogout();
  };

  if (!player) return null;
  if (!player.user) return null;

  return (
    <StyledModal isOpen={isOpen} onClose={onClose}>
      {isAvatarDrawing && <UndoAction onClick={closeAvatarDrawing} />}
      <HeaderSection>
        <StyledHeader>
          <FormattedMessage id="playerModal.title" />
        </StyledHeader>
        <Header4>
          {player.name} - {player.user.email}
        </Header4>
      </HeaderSection>
      <StyledSeparator>
        <FormattedMessage id="playerModal.myInfos" />
      </StyledSeparator>
      {isAvatarDrawing ? (
        <CanvasDraw
          canvasWidth={350}
          canvasHeight={350}
          saveStep={doSaveAvatar}
          displaySaveButton
          initialDrawing={player.avatar}
        />
      ) : (
        <>
          <PlayerForm openAvatarDrawing={openAvatarDrawing} />
          <StyledSeparator>
            <FormattedMessage id="playerModal.myStats" />
          </StyledSeparator>
          <ScoreCardRow>
            <ScoreCard
              linkTo={PUBLIC_PATHS.PLAYER_DETAILS.replace(':playerId', player.uuid)}
              linkToLabelId="playerModal.history"
              loading={scoreLoading}
              label={<FormattedMessage id="playerModal.totalScore" />}
              value={totalScore}
            />
            <ScoreCard
              linkTo="/leaderboard"
              linkToLabelId="playerModal.leaderboard"
              color={colorPalette.purple}
              loading={scoreLoading}
              label={<FormattedMessage id="playerModal.ranking" />}
              value={ranking ? '#' + ranking : 'N/A'}
            />
          </ScoreCardRow>
          <ButtonRow>
            {/* <SecondaryButton>
          <FormattedMessage id="playerModal.changePassword" />
        </SecondaryButton> */}
            <SecondaryButton onClick={logoutAndClose}>
              <FormattedMessage id="playerModal.logOut" />
            </SecondaryButton>
          </ButtonRow>
        </>
      )}
    </StyledModal>
  );
};

export default PlayerModal;
