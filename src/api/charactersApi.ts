import { fetchClient } from "../utils/fetchClient";

export const getCharacters = (
  page = 1,
  params: Record<string, string> = {}
) => {
  const search = new URLSearchParams({
    ...params,
    page: String(page),
  }).toString();
  return fetchClient(`https://rickandmortyapi.com/api/character?${search}`);
};
