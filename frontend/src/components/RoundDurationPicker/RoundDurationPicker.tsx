import React from 'react';
import { DurationOption, RoundDurationPickerContainer } from './RoundDurationPicker.style';

interface Props {
  duration: number;
  onDurationChange: (newValue: number) => void;
}

const DURATION_OPTIONS = [45, 60, 75, 90, 105, 120];

const RoundDurationPicker: React.FC<Props> = ({ duration, onDurationChange }) => (
  <RoundDurationPickerContainer>
    Durée de dessin :{' '}
    {DURATION_OPTIONS.map(option => (
      <DurationOption
        key={option}
        selected={option === duration}
        onClick={() => onDurationChange(option)}
      >
        {option}
      </DurationOption>
    )).reduce(
      (prev: JSX.Element, current) => ([prev, ' - ', current] as unknown) as JSX.Element,
    )}{' '}
    secondes
  </RoundDurationPickerContainer>
);

export default RoundDurationPicker;
