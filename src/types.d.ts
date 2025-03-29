declare module "soundcloud-audio" {
  class SoundCloudAudio {
    constructor(): void;
    audio: HTMLMediaElement;
    _oauthToken: string;
    _playlist: SoundCloudPlaylist;
    _playlistIndex: number;
    play(opts?: { playlistIndex?: number }): void;
    pause(): void;
    previous(): void;
    next(opts: { loop: boolean }): void;
    setTime(time: number): void;
    on(event: string, listener: EventListener): this;
    off(event: string, listener: EventListener): this;
  }
  export default SoundCloudAudio;
}

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SC: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Stats: any;
  webkitAudioContext: typeof AudioContext;
}

type SoundCloudUser = {
  kind: "user";
  id: number;
  avatar_url: string;
  permalink_url: string;
  uri: string;
  username: string;
  permalink: string;
  created_at: string;
  last_modified: string;
  first_name: string;
  last_name: string;
  full_name: string;
  city: string;
  description: string;
  country: string;
  track_count: number;
  public_favorites_count: number;
  reposts_count: number;
  followers_count: number;
  followings_count: number;
  plan: string;
  comments_count: number;
  online: boolean;
  likes_count: number;
  playlist_count: number;
};

type SoundCloudPlaylist = {
  kind: "playlist";
  id: number;
  title: string;
  duration?: number;
  genre?: string;
  permalink?: string;
  permalink_url?: string;
  description?: string;
  uri?: string;
  label_name?: string;
  tag_list?: string;
  track_count?: number;
  user_id?: number;
  last_modified?: string;
  license?: string;
  user?: SoundCloudUser;
  playlist_type?: string;
  type?: string;
  likes_count?: number;
  sharing?: string;
  created_at?: string;
  tags?: string;
  ean?: string;
  streamable?: boolean;
  embeddable_by?: string;
  tracks_uri?: string;
  secret_token?: string;
  secret_uri?: string;
  tracks: SoundCloudTrack[];
};

type SoundCloudTrack = {
  kind: "track";
  id: number;
  created_at: string;
  duration: number;
  commentable: boolean;
  comment_count: number;
  sharing: string;
  tag_list: string;
  streamable: boolean;
  embeddable_by: string;
  genre: string;
  title: string;
  description: string;
  isrc: string;
  license: string;
  uri: string;
  user: SoundCloudUser;
  permalink_url: string;
  artwork_url: string;
  stream_url: string;
  waveform_url: string;
  user_favorite: boolean;
  user_playback_count: number;
  playback_count: number;
  download_count: number;
  favoritings_count: number;
  reposts_count: number;
  downloadable: boolean;
  access: string;
};
