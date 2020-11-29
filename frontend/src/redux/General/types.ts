import { Player } from 'redux/Player/types';

export type LeaderboardPlayer = Player & { rank: number };

export type Leaderboard = LeaderboardPlayer[];

export type LeaderboardResponse = {
  pageData: Leaderboard;
  pageNumber: number;
};
