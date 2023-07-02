import React from 'react';
import { useSelector } from 'react-redux';
import { selectPadViewers } from 'redux/Game/selectors';
import { Pad } from 'redux/Game/types';
import { selectPlayerId } from 'redux/Player/selectors';
import IconAndTooltip from 'atoms/IconAndTooltip';
import { PadTabContainer, ViewersContainer, ViewerEye } from './PadTab.style';

interface Props {
  pad: Pad;
  isActive: boolean;
  onClick: () => void;
  publicMode?: boolean;
  isDebriefPhase: boolean;
}

const PadTab: React.FC<Props> = ({ pad, isActive, onClick, publicMode, isDebriefPhase }) => {
  const allViewers = useSelector(selectPadViewers);
  const playerId = useSelector(selectPlayerId);
  const padViewers = allViewers[pad.uuid];

  if (!publicMode && !playerId) return null;

  return (
    <PadTabContainer isActive={isActive} onClick={onClick} data-test="pad-tab">
      {pad.steps[0].player.name}
      {!publicMode && isDebriefPhase && (
        <ViewersContainer onClick={(e: React.MouseEvent<HTMLDivElement>) => e.preventDefault()}>
          {padViewers
            .filter((viewer) => playerId && viewer.uuid !== playerId)
            .map((viewer) => (
              <IconAndTooltip tooltipText={viewer.name} key={viewer.uuid}>
                <ViewerEye color={viewer.color} />
              </IconAndTooltip>
            ))}
        </ViewersContainer>
      )}
    </PadTabContainer>
  );
};

export default PadTab;
