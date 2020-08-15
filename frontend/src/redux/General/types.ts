import { Player } from 'redux/Player/types';

export type PlayerWithScore = Player & { vote_count: number };

export type Leaderboard = PlayerWithScore[];
