import React from 'react';
import { FormattedMessage } from 'react-intl';
import { PadTabContainer } from '../PadTab/PadTab.style';

interface Props {
  isActive: boolean;
  onClick: () => void;
}

const RecapTab: React.FC<Props> = ({ isActive, onClick }) => (
  <PadTabContainer isActive={isActive} onClick={onClick}>
    <FormattedMessage id="recap.voteResults" />
  </PadTabContainer>
);
export default RecapTab;
