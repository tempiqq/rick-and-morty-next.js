export type Info = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export type Location = {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[]; 
  url: string;
  created: string;
}

export type LocationsApiResponse = {
  info: Info;
  results: Location[];
}