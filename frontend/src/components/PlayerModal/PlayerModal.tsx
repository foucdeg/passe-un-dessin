import React, { useEffect } from 'react';
import { useSelector } from 'redux/useSelector';
import {
  StyledHeader,
  HeaderSection,
  ButtonRow,
  ScoreCardRow,
  StyledSeparator,
} from './PlayerModal.style';
import { FormattedMessage } from 'react-intl';
import PlayerForm from 'components/PlayerForm';
import { selectPlayer, selectPlayerTotalScore, selectPlayerRanking } from 'redux/Player/selectors';
import { useLogout, useFetchTotalScore } from 'redux/Player/hooks';
import Header4 from 'atoms/Header4';
import Modal from 'components/Modal';
import SecondaryButton from 'components/SecondaryButton';
import ScoreCard from 'components/ScoreCard';
import { colorPalette } from 'stylesheet';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PlayerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const player = useSelector(selectPlayer);
  const doLogout = useLogout();
  const [{ loading: scoreLoading }, fetchTotalScore] = useFetchTotalScore();
  const totalScore = useSelector(selectPlayerTotalScore);
  const ranking = useSelector(selectPlayerRanking);

  useEffect(() => {
    if (isOpen) {
      fetchTotalScore();
    }
  }, [fetchTotalScore, isOpen]);

  const logoutAndClose = () => {
    onClose();
    doLogout();
  };

  if (!player) return null;
  if (!player.user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
      <PlayerForm />
      <StyledSeparator>
        <FormattedMessage id="playerModal.myStats" />
      </StyledSeparator>
      <ScoreCardRow>
        <ScoreCard
          loading={scoreLoading}
          label={<FormattedMessage id="playerModal.totalScore" />}
          value={totalScore}
        />
        <ScoreCard
          color={colorPalette.purple}
          loading={scoreLoading}
          label={<FormattedMessage id="playerModal.ranking" />}
          value={'#' + ranking}
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
    </Modal>
  );
};

export default PlayerModal;
