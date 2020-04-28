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
  PLAYER_FINISHED = 'PLAYER_FINISHED',
  PLAYER_CONNECTED = 'PLAYER_CONNECTED',
  PLAYER_LEFT = 'PLAYER_LEFT',
  NEW_ADMIN = 'NEW_ADMIN',
  GAME_STARTS = 'GAME_STARTS',
  ROUND_STARTS = 'ROUND_STARTS',
  DEBRIEF_STARTS = 'DEBRIEF_STARTS',
  PLAYER_VIEWING_PAD = 'PLAYER_VIEWING_PAD',
  VOTE_RESULTS_STARTS = 'VOTE_RESULTS_STARTS',
  ALL_VOTE_COUNT = 'ALL_VOTE_COUNT',
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function useServerSentEvent<EventDataType = any>(
  channel: string | null,
  callback: (msg: EventDataType) => void,
) {
  useEffect(() => {
    if (!channel) return;

    const eventSource: EventSource = new EventSource(
      `${process.env.REACT_APP_EVENTS_HOST}/events/?channel=${channel}`,
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
