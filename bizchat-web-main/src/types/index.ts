export interface Talk {
  id: number;
  title: string;
  speaker: string;
  image: string;
  category: string;
  views?: string;
  duration?: string;
  timeAgo?: string;
}

export interface TrendingTalk {
  id: number;
  title: string;
  image: string;
}

export interface BlogPost {
  id: number
  title: string
  category: string
  image: string
  excerpt?: string
  date?: string
}

export interface Playlist {
  id: number
  image: string
}