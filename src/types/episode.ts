export type Info = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export type Episode = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export type EpisodesApiResponse = {
  info: Info;
  results: Episode[];
}