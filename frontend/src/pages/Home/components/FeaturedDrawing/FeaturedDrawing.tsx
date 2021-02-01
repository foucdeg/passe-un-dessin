import React, { useState, useEffect, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { PadStep } from 'redux/Game/types';
import { Caption, FeaturedDrawingContainer, StyledPic } from './FeaturedDrawing.style';

interface Props {
  padSteps: PadStep[];
}
const FeaturedDrawing: React.FC<Props> = ({ padSteps }) => {
  const [padStepIndex, setpadStepIndex] = useState(0);
  const selectedPadStep = padSteps[padStepIndex];

  const chooseNextPadStep = useCallback(() => {
    setpadStepIndex((padStepIndex + 1) % padSteps.length);
  }, [padStepIndex, padSteps.length]);

  useEffect(() => {
    const timeout = setTimeout(chooseNextPadStep, 10000);
    return () => {
      clearTimeout(timeout);
    };
  }, [chooseNextPadStep]);

  return (
    <FeaturedDrawingContainer>
      <StyledPic>
        <img src={selectedPadStep.drawing_url} alt={selectedPadStep.sentence || ''} />
      </StyledPic>
      <Caption>
        <strong>{selectedPadStep.sentence}</strong>
        <br />
        <FormattedMessage
          id="home.featuredDrawingAuthor"
          values={{
            name: selectedPadStep.player.name,
          }}
        />
      </Caption>
    </FeaturedDrawingContainer>
  );
};

export default FeaturedDrawing;
