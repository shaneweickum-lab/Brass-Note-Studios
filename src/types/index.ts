export interface Song {
  id: string;
  title: string;
  clientName: string;
  genre?: string;
  subgenre?: string | null;
  description?: string;
  audioFile: string;
  sunoUrl?: string;
  spotifyLink?: string;
  published: boolean;
  dateAdded: string;
  category: "Personal Lyrics" | "Song Production" | "Comprehensive Services" | "From the Lab" | "Collaboration";
  mood?: string[];
  coverImage?: string | null;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  published: boolean;
}

export interface ServicePackage {
  name: string;
  price: string;
  description: string;
  checkoutUrl?: string;
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
  analyser: AnalyserNode | null;
}
