import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { selectCurrentStreams } from 'redux/Twitch/selectors';
import { useFetchCurrentStreams } from 'redux/Twitch/hooks';
import { useSelector } from 'redux/useSelector';
import Loader from 'atoms/Loader';

import TwitchStream from '../TwitchStream';

import { Header, StyledModal, Content } from './TwitchModal.style';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TwitchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const currentStreams = useSelector(selectCurrentStreams);
  const doFetchCurrentStreams = useFetchCurrentStreams();

  useEffect(() => {
    doFetchCurrentStreams();
  }, [doFetchCurrentStreams]);

  return (
    <StyledModal isOpen={isOpen} onClose={onClose}>
      <Header>
        <FormattedMessage id="home.twitchModal.title" />
      </Header>
      <Content>
        {currentStreams === null ? (
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
