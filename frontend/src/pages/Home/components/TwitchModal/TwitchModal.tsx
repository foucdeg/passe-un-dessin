import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import Loader from 'atoms/Loader';

import TwitchStream from '../TwitchStream';
import { useCurrentStreams } from './hooks';

import { Header, StyledModal, Content } from './TwitchModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TwitchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [{ value: currentStreams }, doFetchCurrentStreams] = useCurrentStreams();

  useEffect(() => {
    doFetchCurrentStreams();
  }, [doFetchCurrentStreams]);

  return (
    <StyledModal isOpen={isOpen} onClose={onClose}>
      <Header>
        <FormattedMessage id="home.twitchModal.title" />
      </Header>
      <Content>
        {currentStreams === undefined ? (
          <Loader />
        ) : currentStreams.length === 0 ? (
          <FormattedMessage id="home.twitchModal.noStreams" />
        ) : (
          currentStreams
            .slice()
            .sort((stream1, stream2) => stream2.viewer_count - stream1.viewer_count)
            .map((stream) => <TwitchStream key={stream.twitch_id} stream={stream} />)
        )}
      </Content>
    </StyledModal>
  );
};

export default TwitchModal;
