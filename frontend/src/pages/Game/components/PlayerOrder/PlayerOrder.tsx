import React from 'react';
import { useSelector } from 'redux/useSelector';
import { selectGame } from 'redux/Game/selectors';
import { selectPlayerId } from 'redux/Player/selectors';
import { getReorderedPlayers } from 'services/game.service';
import { EmptyObject } from 'services/utils';
import { PlayerOrderContainer, StyledPlayerChip, ArrowSpacer, Variant } from './PlayerOrder.style';

const PlayerOrder: React.FC<EmptyObject> = () => {
  const game = useSelector(selectGame);
  const playerId = useSelector(selectPlayerId);

  if (!game || !playerId) return null;

  const [padOwner, ...orderedPlayers] = getReorderedPlayers(game, playerId);

  const getChipVariant = (roundIndex: number) => {
    if (roundIndex < game.current_round) return Variant.PAST;
    if (roundIndex === game.current_round) return Variant.CURRENT;
    return Variant.FUTURE;
  };

  return (
    <PlayerOrderContainer>
      <StyledPlayerChip variant={getChipVariant(0)} data-test="player-order">
        🗒&nbsp;{padOwner.name}
      </StyledPlayerChip>
      {orderedPlayers.map((orderedPlayer, index) => (
        <React.Fragment key={orderedPlayer.uuid}>
          <ArrowSpacer />
          <StyledPlayerChip
            variant={getChipVariant(index + 1)}
            key={orderedPlayer.uuid}
            data-test="player-order"
          >
            {index % 2 === 0 ? '🎨' : '🤔'}&nbsp;
            {orderedPlayer.name}
          </StyledPlayerChip>
        </React.Fragment>
      ))}
    </PlayerOrderContainer>
  );
};

export default PlayerOrder;
