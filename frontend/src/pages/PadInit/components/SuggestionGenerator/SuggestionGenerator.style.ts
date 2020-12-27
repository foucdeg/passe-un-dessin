import styled from 'styled-components';
import PlayerChip from 'atoms/PlayerChip';
import diceImage from 'assets/dice.svg';

export const SuggestionGeneratorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
`;

export const Suggestions = styled.div`
  display: flex;
`;

export const SuggestionChip = styled(PlayerChip)`
  cursor: pointer;
  margin-bottom: 0;
`;

export const Dice = styled.img.attrs({ src: diceImage })`
  width: 200px;
  height: 200px;
  cursor: pointer;

  &.toggled-a {
    animation: roll-one 1s 1;
  }

  &.toggled-b {
    animation: roll-two 1s 1;
  }

  @keyframes roll-one {
    100% {
      transform: rotate(1080deg);
    }
  }
  @keyframes roll-two {
    100% {
      transform: rotate(1080deg);
    }
  }
`;

export const Subheader = styled.strong`
  line-height: 36px;
`;
