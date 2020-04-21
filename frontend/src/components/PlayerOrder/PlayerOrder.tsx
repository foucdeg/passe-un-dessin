import React from 'react';
import { useSelector } from 'redux/useSelector';
import { selectGame } from 'redux/Game/selectors';
import { selectPlayer } from 'redux/Player/selectors';
import { getReorderedPlayers } from 'services/game.service';
import { FormattedMessage } from 'react-intl';
import { PlayerOrderContainer, StyledPlayerChip, ArrowSpacer, Variant } from './PlayerOrder.style';
import { GamePhase } from 'redux/Game/types';

const PlayerOrder: React.FC<{}> = () => {
  const game = useSelector(selectGame);
  const player = useSelector(selectPlayer);

  if (!game || !player) return null;

  const [padOwner, ...orderedPlayers] = getReorderedPlayers(game, player);

  const getChipVariant = (roundIndex: number | null) => {
    if (roundIndex === null) {
      return game.phase === GamePhase.INIT ? Variant.CURRENT : Variant.PAST;
    }
    if (game.current_round === null) {
      return Variant.FUTURE;
    }
    if (roundIndex < game.current_round) return Variant.PAST;
    if (roundIndex === game.current_round) return Variant.CURRENT;
    return Variant.FUTURE;
  };

  return (
    <PlayerOrderContainer>
      <StyledPlayerChip variant={getChipVariant(null)}>
        <FormattedMessage id="game.padOwner" values={{ name: padOwner.name }} />
      </StyledPlayerChip>
      {orderedPlayers.map((orderedPlayer, index) => (
        <React.Fragment key={orderedPlayer.uuid}>
          <ArrowSpacer />
          <StyledPlayerChip variant={getChipVariant(index)} key={orderedPlayer.uuid}>
            {orderedPlayer.name}
          </StyledPlayerChip>
        </React.Fragment>
      ))}
    </PlayerOrderContainer>
  );
};

export default PlayerOrder;
