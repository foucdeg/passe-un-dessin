export interface Streamer {
  twitch_id: string;
  name: string;
}

export interface Stream {
  twitch_id: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  streamer: Streamer;
}
