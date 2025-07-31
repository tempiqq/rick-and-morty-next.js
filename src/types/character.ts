export type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  episode: string[];
  url: string;
  created: string;
};

export type Info = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};


export type CharactersApiResponse = {
  info: Info;
  results: Character[];
}