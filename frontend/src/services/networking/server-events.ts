import { useEffect } from 'react';
import { Player } from 'redux/Player/types';
import { Game } from 'redux/Game/types';

export interface NewPlayerEventDataType {
  player: Player;
}

export interface GameStartsEventDataType {
  game: Game;
}

export interface RoundStartsEventType {
  round_number: number;
}

export enum SERVER_EVENT_TYPES {
  PLAYER_CONNECTED = 'PLAYER_CONNECTED',
  GAME_STARTS = 'GAME_STARTS',
  ROUND_STARTS = 'ROUND_STARTS',
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function useServerSentEvent<EventDataType = any>(
  channel: string,
  callback: (msg: EventDataType) => void,
  messageType?: string,
) {
  useEffect(() => {
    const eventSource: EventSource = new EventSource(
      `${process.env.REACT_APP_EVENTS_HOST}/events/?channel=${channel}`,
    );
    eventSource.onmessage = (event: MessageEvent) => {
      const parsedEvent = JSON.parse(event.data);
      if (messageType && parsedEvent.messageType !== messageType) return;

      callback(parsedEvent as EventDataType);
    };

    return () => {
      eventSource.close();
    };
  }, [channel, messageType, callback]);
}
