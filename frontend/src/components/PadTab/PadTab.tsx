import React from 'react';
import { useSelector } from 'react-redux';
import { selectPadViewers } from 'redux/Game/selectors';
import { Pad } from 'redux/Game/types';
import { PadTabContainer, ViewersContainer, ViewerEye } from './PadTab.style';
import { selectPlayer } from 'redux/Player/selectors';

interface Props {
  pad: Pad;
  isActive: boolean;
  onClick: () => void;
}

const PadTab: React.FC<Props> = ({ pad, isActive, onClick }) => {
  const allViewers = useSelector(selectPadViewers);
  const player = useSelector(selectPlayer);
  const padViewers = allViewers[pad.uuid];

  if (!player) return null;

  return (
    <PadTabContainer isActive={isActive} onClick={onClick}>
      {pad.initial_player.name}
      <ViewersContainer onClick={e => e.preventDefault()}>
        {padViewers
          .filter(viewer => viewer.uuid !== player.uuid)
          .map(viewer => (
            <ViewerEye key={viewer.uuid} color={viewer.color} title={viewer.name} />
          ))}
      </ViewersContainer>
    </PadTabContainer>
  );
};

export default PadTab;
