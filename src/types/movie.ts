export type BrazilianRating = 'L' | '10' | '12' | '14' | '16' | '18';

export type StreamingProviderId = 'netflix' | 'prime' | 'max' | 'disney' | 'apple' | 'globoplay' | 'paramount';

export interface StreamingOption {
  id: StreamingProviderId;
  name: string;
  type: 'subscription' | 'rent' | 'buy';
  quality: '4K HDR' | '4K' | 'Full HD' | 'HD';
  deepLink?: string;
}

export type MovieMood = 
  | 'chorar_de_rir' 
  | 'roer_unhas' 
  | 'explodir_cabeca' 
  | 'relaxar' 
  | 'cinema_nacional' 
  | 'emocionar' 
  | 'sessao_pipoca'
  | 'familia';

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  year: number;
  runtime: number; // in minutes
  genres: string[];
  imdbRating: number;
  rottenScore?: number;
  brazilianRating: BrazilianRating;
  brazilianRatingReason: string;
  synopsis: string;
  director: string;
  cast: string[];
  posterUrl: string;
  backdropUrl: string;
  trailerYoutubeId: string;
  providers: StreamingOption[];
  moods: MovieMood[];
  featured?: boolean;
  matchAffinity?: number; // e.g. 98%
  trendingRank?: number;
  tagline?: string;
  country: string;
}

export interface WatchlistItem {
  movieId: string;
  addedAt: string;
  watched: boolean;
  userRating?: number; // 1-5 popcorns
  favorite?: boolean;
  notes?: string;
}

export interface WatchPartyMember {
  id: string;
  name: string;
  avatar: string;
  status: 'pronto' | 'pegando pipoca' | 'atrasado';
  isHost?: boolean;
}

export interface WatchPartyMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  isReaction?: boolean;
}
