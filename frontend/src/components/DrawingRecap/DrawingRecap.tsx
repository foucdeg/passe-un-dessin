import React from 'react';
import { useIntl } from 'react-intl';
import { StyledDrawingRecap, LikeEmoji, StyledIconAndTooltip } from './DrawingRecap.style';
import CanvasDraw from 'react-canvas-draw';
import lzString from 'lz-string';
import { CanvasWrapper } from 'components/WordToDrawingStep/WordToDrawingStep.style';
import { SentenceHeader } from 'components/SentenceRecap/SentenceRecap.style';
import { PadStep } from 'redux/Game/types';
import { useSaveVote, useDeleteVote } from 'redux/Game/hooks';
import { selectPlayer } from 'redux/Player/selectors';
import { useSelector } from 'redux/useSelector';
import { selectAvailableVoteCount } from 'redux/Game/selectors';

interface Props {
  step: PadStep;
  enableVote?: boolean | null;
}

const DrawingRecap: React.FC<Props> = ({ step, enableVote }) => {
  const player = useSelector(selectPlayer);
  const availableVoteCount = useSelector(selectAvailableVoteCount);
  const liked = !!(player && step.votes.find(vote => vote.player.uuid === player.uuid));

  const doSaveVote = useSaveVote();
  const doDeleteVote = useDeleteVote();

  const intl = useIntl();

  const onLike = () => {
    if (liked) {
      doDeleteVote(step.uuid);
    } else {
      doSaveVote(step.uuid);
    }
  };

  return (
    <StyledDrawingRecap>
      <SentenceHeader>
        {step.player.name}{' '}
        {enableVote && (
          <StyledIconAndTooltip
            tooltipStyle={{
              right: '-50px',
              width: '200px',
              textAlign: 'center',
              top: '25px',
            }}
            tooltipText={intl.formatMessage({ id: 'recap.availableVotes' }, { availableVoteCount })}
          >
            <LikeEmoji onClick={onLike} liked={liked}>
              &#128525;
            </LikeEmoji>
          </StyledIconAndTooltip>
        )}
      </SentenceHeader>
      <CanvasWrapper liked={enableVote && liked}>
        <CanvasDraw
          disabled
          canvasWidth={236}
          canvasHeight={236}
          hideGrid
          saveData={lzString.decompressFromBase64(step.drawing)}
        />
      </CanvasWrapper>
    </StyledDrawingRecap>
  );
};

export default DrawingRecap;
