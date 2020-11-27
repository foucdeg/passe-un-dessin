import { Player } from 'redux/Player/types';

export type LeaderboardPlayer = Player & { vote_count: number };

export type Leaderboard = LeaderboardPlayer[];

export type LeaderboardResponse = {
  pageData: Leaderboard;
  pageNumber: number;
};
