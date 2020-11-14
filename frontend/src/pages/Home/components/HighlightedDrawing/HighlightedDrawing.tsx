import React from 'react';
import { FormattedMessage } from 'react-intl';
import { PadStep } from 'redux/Game/types';
import parseISO from 'date-fns/parseISO';
import { Frame, Mat, InnerPic, Caption } from './HighlightedDrawing.style';

interface Props {
  padStep: PadStep;
}
const HighlightedDrawing: React.FC<Props> = ({ padStep }) => (
  <>
    <Frame>
      <Mat>
        <InnerPic>
          <img src={padStep.drawing_url} alt={padStep.sentence || ''} />
        </InnerPic>
      </Mat>
    </Frame>
    <Caption>
      <FormattedMessage
        id="home.highlightedDrawingCaption"
        values={{
          sentence: padStep.sentence,
          name: padStep.player.name,
          year: parseISO(padStep.created_at).getFullYear(),
          em: (...stuff: string[]) => <em>{stuff}</em>,
        }}
      />
    </Caption>
  </>
);

export default HighlightedDrawing;
