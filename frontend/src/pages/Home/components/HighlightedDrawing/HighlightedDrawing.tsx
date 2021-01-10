import React, { useState, useEffect, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { PadStep } from 'redux/Game/types';
import parseISO from 'date-fns/parseISO';
import {
  Frame,
  Mat,
  InnerPic,
  Caption,
  PreviousIcon,
  NextIcon,
  AllSteps,
  Step,
} from './HighlightedDrawing.style';

interface Props {
  padSteps: PadStep[];
}
const HighlightedDrawing: React.FC<Props> = ({ padSteps }) => {
  const [padStepIndex, setpadStepIndex] = useState(0);
  const selectedPadStep = padSteps[padStepIndex];

  const chooseNextPadStep = useCallback(() => {
    setpadStepIndex((padStepIndex + 1) % padSteps.length);
  }, [padStepIndex, padSteps.length]);

  const choosePreviousPadStep = useCallback(() => {
    if (padStepIndex === 0) {
      setpadStepIndex(padSteps.length - 1);
      return;
    }
    setpadStepIndex(padStepIndex - 1);
  }, [padStepIndex, padSteps.length]);

  useEffect(() => {
    const timeout = setTimeout(chooseNextPadStep, 10000);
    return () => {
      clearTimeout(timeout);
    };
  }, [chooseNextPadStep]);

  return (
    <>
      <Frame>
        <PreviousIcon onClick={choosePreviousPadStep} />
        <Mat>
          <InnerPic>
            <img src={selectedPadStep.drawing_url} alt={selectedPadStep.sentence || ''} />
          </InnerPic>
          <AllSteps>
            {padSteps.map((padStep: PadStep, index: number) => (
              <Step key={padStep.uuid} isCurrent={index === padStepIndex} />
            ))}
          </AllSteps>
        </Mat>
        <NextIcon onClick={chooseNextPadStep} />
      </Frame>
      <Caption>
        <FormattedMessage
          id="home.highlightedDrawingCaption"
          values={{
            sentence: selectedPadStep.sentence,
            name: selectedPadStep.player.name,
            year: parseISO(selectedPadStep.created_at).getFullYear(),
            em: (...stuff: string[]) => <em>{stuff}</em>,
          }}
        />
      </Caption>
    </>
  );
};

export default HighlightedDrawing;
