import React from 'react';
import { useSelector } from 'redux/useSelector';
import { FormattedMessage } from 'react-intl';
import { selectRanking } from 'redux/Room/selectors';
import { StyledHeader, PlayerScore, StyledModal, VoteCount, Trophy } from './RankingModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RankingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const ranking = useSelector(selectRanking);

  if (!ranking) return null;

  return (
    <StyledModal isOpen={isOpen} onClose={onClose}>
      <StyledHeader>
        <FormattedMessage id="rankingModal.title" />
      </StyledHeader>
      {ranking.length > 0 ? (
        ranking.map((rank, index) => (
          <PlayerScore key={rank.player.uuid} backgroundColor={rank.player.color}>
            {index === 0 && rank.vote_count > 0 && <Trophy />}
            {rank.player.name}
            <VoteCount>{rank.vote_count}</VoteCount>
          </PlayerScore>
        ))
      ) : (
        <FormattedMessage id="rankingModal.noRanking" />
      )}
    </StyledModal>
  );
};

export default RankingModal;
