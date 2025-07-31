const BASE_URL = "https://rickandmortyapi.com/api";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// Базова функція для fetch з обробкою помилок
export const fetchApi = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null, loading: false };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { data: null, error: errorMessage, loading: false };
  }
};

// Типи для API відповідей
export interface CharactersResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Array<{
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: { name: string; url: string };
    location: { name: string; url: string };
    image: string;
    episode: string[];
    url: string;
    created: string;
  }>;
}

export interface EpisodesResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Array<{
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
    url: string;
    created: string;
  }>;
}

// Функції для різних API endpoints
export const api = {
  // Отримати одного персонажа
  getCharacter: (id: string | number) =>
    fetchApi<{
      id: number;
      name: string;
      status: string;
      species: string;
      type: string;
      gender: string;
      origin: { name: string; url: string };
      location: { name: string; url: string };
      image: string;
      episode: string[];
      url: string;
      created: string;
    }>(`${BASE_URL}/character/${id}`),

  // Отримати список персонажів з фільтрами
  getCharacters: (params?: {
    name?: string;
    status?: string;
    gender?: string;
    page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.name) searchParams.set("name", params.name);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.gender) searchParams.set("gender", params.gender);
    if (params?.page) searchParams.set("page", params.page.toString());

    const queryString = searchParams.toString();
    const url = `${BASE_URL}/character${queryString ? `?${queryString}` : ""}`;

    return fetchApi<CharactersResponse>(url);
  },

  // Отримати список епізодів
  getEpisodes: (page?: number) => {
    const url = page
      ? `${BASE_URL}/episode?page=${page}`
      : `${BASE_URL}/episode`;
    return fetchApi<EpisodesResponse>(url);
  },
};
