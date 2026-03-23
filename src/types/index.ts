export interface Show {
  id: number | string;
  name: string; // TMDB uses name for TV Shows, not title
  poster_path: string | null;
  overview: string; // TMDB uses overview for TV shows
  first_air_date?: string;
  release_date?: string;
  
  // Eski uyumluluk veya ekstra eklentiler için opsiyoneller
  title?: string; 
  poster_url?: string;
  synopsis?: string;
  seasons?: number[];
}

export interface UserInfo {
  id: string;
  name: string;
  avatar_url: string;
}

export interface CommentNode {
  id: string;
  user: UserInfo;
  content: string;
  isSpoiler: boolean;
  createdAt: string;
  replies: CommentNode[];
}
