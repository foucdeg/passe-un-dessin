import { useEffect } from 'react';

export interface BaseEvent {
  message_type: string;
}

export function useServerSentEvent<EventDataType = BaseEvent>(
  channel: string | null,
  callback: (msg: EventDataType) => void,
) {
  useEffect(() => {
    if (!channel) return;

    const eventSource: EventSource = new EventSource(
      `${process.env.REACT_APP_EVENTS_HOST}/?channel=${channel}`,
    );
    eventSource.onmessage = (event: MessageEvent) => {
      const parsedEvent = JSON.parse(event.data);

      callback(parsedEvent as EventDataType);
    };

    return () => {
      eventSource.close();
    };
  }, [channel, callback]);
}
