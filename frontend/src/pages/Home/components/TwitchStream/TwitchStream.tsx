import React from 'react';
import { Stream } from '../TwitchModal/types';

import {
  StreamImage,
  StreamerName,
  StreamTitle,
  StreamViewerCount,
  StyledBareAnchor,
  Header,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  StyledEye,
} from './TwitchStream.style';

interface Props {
  stream: Stream;
}

const TwitchStream: React.FC<Props> = ({ stream }) => {
  const imageUrl = stream.thumbnail_url
    .replace('{width}', IMAGE_WIDTH.toString())
    .replace('{height}', IMAGE_HEIGHT.toString());
  return (
    <StyledBareAnchor
      href={`https://www.twitch.tv/${stream.streamer.name}`}
      target="_blank"
      rel="noreferrer"
    >
      <Header>
        <StreamerName>{stream.streamer.name}</StreamerName>
        <StreamViewerCount>
          <StyledEye />
          {stream.viewer_count}
        </StreamViewerCount>
      </Header>
      <StreamImage src={imageUrl}></StreamImage>
      <StreamTitle>{stream.title}</StreamTitle>
    </StyledBareAnchor>
  );
};

export default TwitchStream;
