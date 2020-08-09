import React, { useState } from 'react';
import { useSelector } from 'redux/useSelector';
import { selectSuggestions } from 'redux/Game/selectors';
import { useGetSuggestions } from 'redux/Game/hooks';
import {
  SuggestionGeneratorContainer,
  Suggestions,
  SuggestionChip,
  Dice,
  Subheader,
} from './SuggestionGenerator.style';
import { FormattedMessage } from 'react-intl';

interface Props {
  onSuggestionClick: (suggestion: string) => void;
}

const SuggestionGenerator: React.FC<Props> = ({ onSuggestionClick }) => {
  const [triggered, setTriggered] = useState<boolean | null>(null);

  const suggestions = useSelector(selectSuggestions);
  const doGetSuggestions = useGetSuggestions();

  const onDiceRoll = () => {
    setTriggered(!triggered);
    doGetSuggestions();
  };

  const diceClassName = triggered === true ? 'toggled-a' : triggered === false ? 'toggled-b' : '';

  return (
    <SuggestionGeneratorContainer>
      {suggestions.length ? (
        <Suggestions>
          {suggestions.map((suggestion) => (
            <SuggestionChip key={suggestion} onClick={() => onSuggestionClick(suggestion)}>
              {suggestion}
            </SuggestionChip>
          ))}
        </Suggestions>
      ) : (
        <Subheader>
          <FormattedMessage id="padInit.getSuggestions" />
        </Subheader>
      )}
      <Dice onClick={onDiceRoll} className={diceClassName} />
    </SuggestionGeneratorContainer>
  );
};

export default SuggestionGenerator;
