import { useEffect } from 'react';
import { Player } from 'redux/Player/types';

export interface NewPlayerEventDataType {
  player: Player;
}

export enum SERVER_EVENT_TYPES {
  PLAYER_CONNECTED = 'PLAYER_CONNECTED',
}

export function useServerSentEvent<EventDataType>(
  channel: string,
  messageType: string,
  callback: (msg: EventDataType) => void,
) {
  useEffect(() => {
    const eventSource: EventSource = new EventSource(
      `${process.env.REACT_APP_EVENTS_HOST}/events/?channel=${channel}`,
    );
    eventSource.onmessage = (event: MessageEvent) => {
      const { message_type: receivedMessageType, ...data } = JSON.parse(event.data);
      if (receivedMessageType !== messageType) return;

      callback(data as EventDataType);
    };

    return () => {
      eventSource.close();
    };
  }, [channel, messageType, callback]);
}
