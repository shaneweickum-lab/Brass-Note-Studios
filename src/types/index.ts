export interface AudioSource {
  type: "mp3" | "suno_embed";
  mp3Url: string;
  sunoId?: string;
  sunoUrl?: string;
}

export interface Song {
  id: string;
  title: string;
  clientName: string;
  description?: string;
  category: "Personal Lyrics" | "Song Production" | "Comprehensive Services";
  genre?: string;
  mood?: string[];
  featured: boolean;
  publishedDate: string;
  audioSource: AudioSource;
  coverImage?: string | null;
}

export interface ServicePackage {
  name: string;
  price: string;
  description: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  delivery: string;
  included: string;
  packages: ServicePackage[];
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  clientTitle?: string;
  rating: number;
}

export type PlayerState = "idle" | "loading" | "playing" | "paused" | "error";

export interface PlayerContextType {
  queue: Song[];
  currentSongId: string | null;
  playerState: PlayerState;
  currentTime: number;
  duration: number;
  volume: number;
  play: (songId: string, songs?: Song[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  currentSong: Song | null;
}
