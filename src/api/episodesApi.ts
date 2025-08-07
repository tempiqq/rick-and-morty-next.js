import { fetchClient } from "../utils/fetchClient";

export const getEpisodes = (page = 1) =>
  fetchClient(`https://rickandmortyapi.com/api/episode?page=${page}`);

export const getEpisodeById = (id: number) =>
  fetchClient(`https://rickandmortyapi.com/api/episode/${id}`);
