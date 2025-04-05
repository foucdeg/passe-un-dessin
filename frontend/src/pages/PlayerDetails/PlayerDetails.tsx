import React, { useEffect } from 'react';
import { NoProps } from 'services/utils';
import { useParams } from 'react-router';
import { useFetchPlayer } from 'redux/Player/hooks';

import { format, parseISO } from 'date-fns';
import { enUS, fr, de } from 'date-fns/locale';

import GameContainer from 'layout/GameLayout/GameContainer';
import Loader from 'atoms/Loader';
import { colorPalette } from 'stylesheet';
import { FormattedMessage, useIntl } from 'react-intl';
import PlayerChip from 'atoms/PlayerChip';
import { GameWithParticipants, Participation } from 'redux/Player/types';
import { PUBLIC_PATHS } from 'routes';
import BareLink from 'atoms/BareLink';
import ChipButton, { NextStepIcon } from 'atoms/ChipButton';
import {
  StyledInnerContainer,
  LeftSide,
  RightSide,
  StyledHeader,
  StyledScoreCard,
  SyledSeparator,
  PlayerChips,
  HistoryGame,
  StyledAvatar,
} from './PlayerDetails.style';

interface RouteParams {
  playerId: string;
}

type ValidParticipation = Participation & {
  game: GameWithParticipants;
};

const isValidParticipation = (participation: Participation): participation is ValidParticipation =>
  !!participation.game;

const InnerPlayerDetails: React.FC<{ playerId: string }> = ({ playerId }) => {
  const [{ loading, value: displayedPlayer }, doFetchPlayer] = useFetchPlayer();
  const { locale } = useIntl();
  const dateLocale = locale === 'fr' ? fr : locale === 'en' ? enUS : de;

  useEffect(() => {
    doFetchPlayer(playerId);
  }, [doFetchPlayer, playerId]);

  if (loading || !displayedPlayer) {
    return (
      <GameContainer>
        <StyledInnerContainer>
          <Loader />
        </StyledInnerContainer>
      </GameContainer>
    );
  }

  const filteredParticipations: ValidParticipation[] =
    displayedPlayer.participations.filter(isValidParticipation);

  return (
    <GameContainer>
      <StyledInnerContainer>
        <LeftSide>
          <StyledAvatar player={displayedPlayer} />
          <StyledHeader>{displayedPlayer.name}</StyledHeader>

          <StyledScoreCard
            label={<FormattedMessage id="playerModal.totalScore" />}
            value={displayedPlayer.total_score}
          />
          <StyledScoreCard
            linkTo="/leaderboard"
            linkToLabelId="playerModal.leaderboard"
            color={colorPalette.purple}
            label={<FormattedMessage id="playerModal.ranking" />}
            value={displayedPlayer.rank ? '#' + displayedPlayer.rank : 'N/A'}
          />
        </LeftSide>

        <RightSide>
          {filteredParticipations.map((participation, index) => {
            const previousParticipation = index > 0 ? filteredParticipations[index - 1] : null;
            const displayMonthSeparator =
              !previousParticipation ||
              parseISO(previousParticipation.game.created_at).getFullYear() !==
                parseISO(participation.game.created_at).getFullYear() ||
              parseISO(previousParticipation.game.created_at).getMonth() !==
                parseISO(participation.game.created_at).getMonth();

            return (
              <React.Fragment key={participation.game.uuid}>
                {displayMonthSeparator && (
                  <SyledSeparator>
                    {format(parseISO(participation.game.created_at), 'MMMM y', {
                      locale: dateLocale,
                    })}
                  </SyledSeparator>
                )}
                <HistoryGame>
                  {format(parseISO(participation.game.created_at), 'P', {
                    locale: dateLocale,
                  })}
                  <PlayerChips>
                    {participation.game.participants
                      .filter((participant) => participant.player.uuid !== displayedPlayer.uuid)
                      .map((participant) => (
                        <PlayerChip color={participant.player.color} key={participant.player.uuid}>
                          <BareLink
                            to={PUBLIC_PATHS.PLAYER_DETAILS.replace(
                              ':playerId',
                              participant.player.uuid,
                            )}
                          >
                            {participant.player.name}
                          </BareLink>
                        </PlayerChip>
                      ))}
                    <BareLink
                      to={`/game/${participation.game.uuid}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ChipButton>
                        <FormattedMessage id="playerDetails.seeGame" />
                        <NextStepIcon />
                      </ChipButton>
                    </BareLink>
                  </PlayerChips>
                </HistoryGame>
              </React.Fragment>
            );
          })}
        </RightSide>
      </StyledInnerContainer>
    </GameContainer>
  );
};

const PlayerDetails: React.FC<NoProps> = () => {
  const { playerId } = useParams<keyof RouteParams>() as RouteParams;

  // key={playerId} creates a new component if playerId changes
  return <InnerPlayerDetails key={playerId} playerId={playerId} />;
};

export default PlayerDetails;
