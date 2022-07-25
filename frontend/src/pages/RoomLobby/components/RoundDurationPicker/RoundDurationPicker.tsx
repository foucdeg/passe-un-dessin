import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DurationOption, RoundDurationPickerContainer } from './RoundDurationPicker.style';

interface Props {
  duration: number;
  onDurationChange: (newValue: number) => void;
}

const DURATION_OPTIONS = [45, 60, 75, 90, 105, 120];

const RoundDurationPicker: React.FC<Props> = ({ duration, onDurationChange }) => (
  <RoundDurationPickerContainer>
    <FormattedMessage
      id="roomLobby.timeDuration"
      values={{
        options: DURATION_OPTIONS.map((option) => (
          <DurationOption
            key={option}
            selected={option === duration}
            onClick={() => onDurationChange(option)}
            data-test="duration-option"
          >
            {option}
          </DurationOption>
        )).reduce((prev: JSX.Element, current) => [prev, ' - ', current] as unknown as JSX.Element),
        strong: (...chunks: string[]) => <strong>{chunks}</strong>,
      }}
    />
  </RoundDurationPickerContainer>
);

export default RoundDurationPicker;
