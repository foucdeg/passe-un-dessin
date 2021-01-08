import React from 'react';
import { useSelector } from 'react-redux';
import { selectPadViewers } from 'redux/Game/selectors';
import { Pad } from 'redux/Game/types';
import { selectPlayer } from 'redux/Player/selectors';
import IconAndTooltip from 'atoms/IconAndTooltip';
import { PadTabContainer, ViewersContainer, ViewerEye } from './PadTab.style';

interface Props {
  pad: Pad;
  isActive: boolean;
  onClick: () => void;
  publicMode?: boolean;
}

const PadTab: React.FC<Props> = ({ pad, isActive, onClick, publicMode }) => {
  const allViewers = useSelector(selectPadViewers);
  const player = useSelector(selectPlayer);
  const padViewers = allViewers[pad.uuid];

  if (!publicMode && !player) return null;

  return (
    <PadTabContainer isActive={isActive} onClick={onClick}>
      {pad.steps[0].player.name}
      {!publicMode && (
        <ViewersContainer onClick={(e) => e.preventDefault()}>
          {padViewers
            .filter((viewer) => player && viewer.uuid !== player.uuid)
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
