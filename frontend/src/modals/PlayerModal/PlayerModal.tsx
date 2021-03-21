import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'redux/useSelector';
import { FormattedMessage } from 'react-intl';
import { selectPlayer, selectPlayerId } from 'redux/Player/selectors';
import { useLogout, useFetchMe, useEditPlayer } from 'redux/Player/hooks';
import Header4 from 'atoms/Header4';
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
  StyledCanvasDraw,
} from './PlayerModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PlayerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const player = useSelector(selectPlayer);
  const playerId = useSelector(selectPlayerId);
  const doLogout = useLogout();
  const [{ loading }, doFetchMe] = useFetchMe();
  const [isAvatarDrawing, openAvatarDrawing, closeAvatarDrawing] = useBoolean(false);
  const doEditPlayer = useEditPlayer();

  const doSaveAvatar = useCallback(
    async (drawing: string) => {
      if (!playerId) return;
      await doEditPlayer({ uuid: playerId, avatar: drawing });
      closeAvatarDrawing();
    },
    [closeAvatarDrawing, doEditPlayer, playerId],
  );

  useEffect(() => {
    if (isOpen) {
      doFetchMe({ withRank: true });
    }
  }, [doFetchMe, isOpen]);

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
        <StyledCanvasDraw
          canvasWidth={350}
          canvasHeight={350}
          saveStep={doSaveAvatar}
          displaySaveButton
          initialUrl={player.avatar_url}
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
              loading={loading}
              label={<FormattedMessage id="playerModal.totalScore" />}
              value={player.total_score}
            />
            <ScoreCard
              linkTo="/leaderboard"
              linkToLabelId="playerModal.leaderboard"
              color={colorPalette.purple}
              loading={loading}
              label={<FormattedMessage id="playerModal.ranking" />}
              value={player.rank ? '#' + player.rank : 'N/A'}
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
