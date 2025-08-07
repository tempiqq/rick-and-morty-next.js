# Rick and Morty Wiki - Детальний Туторіал

## Теоретичне введення

### Що ми будемо робити

Ми створюємо веб-застосунок для перегляду персонажів з серіалу Rick and Morty. Застосунок буде мати:

- Список персонажів з пагінацією
- Пошук за ім'ям
- Фільтрацію за статусом та статтю
- Детальну сторінку персонажа
- Сторінку епізодів

### Технології які будемо використовувати

- **Next.js 15** - React фреймворк для створення веб-застосунків
- **TypeScript** - для типізації коду
- **Tailwind CSS** - для стилізації
- **Rick and Morty API** - для отримання даних

### Концепції які потрібно знати

- **React Hooks** (useState, useEffect, useMemo)
- **TypeScript** (типи, інтерфейси, дженерики)
- **Next.js App Router** (файлова система роутингу)
- **URL Search Params** (робота з параметрами URL)

---

## Крок 1: Налаштування проєкту

### Створення проєкту

```bash
npx create-next-app@latest rick-and-morty-wiki --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### Структура папок

```
rick-and-morty-wiki/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React компоненти
│   ├── hooks/         # Кастомні хуки
│   └── types/         # TypeScript типи
├── public/            # Статичні файли
└── package.json
```

**Пояснення структури:**

- `src/app/` - тут будуть всі сторінки застосунку (Next.js App Router)
- `src/components/` - перевикористовувані React компоненти
- `src/hooks/` - кастомні хуки для логіки
- `src/types/` - TypeScript типи для типізації даних

---

## Крок 2: Створення типів даних

### Створюємо файл `src/types/common.ts`

```typescript
export type Info = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};
```

### Створюємо файл `src/types/character.ts`

```typescript
import { Info } from "./common";

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
```

**Пояснення типів:**

- `Info` - тип для метаданих пагінації з API
- `Character` - тип для даних персонажа
- Використовуємо `type` замість `interface` для простішої типізації
- Структуру типів беремо з документації Rick and Morty API

---

## Крок 3: Створення базового хука для API

### Створюємо файл `src/hooks/useApi.ts`

```typescript
import { useState, useEffect } from "react";

type ApiResponse<T> = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
};

export const useApi = <T>(
  endpoint: string,
  page: number = 1,
  searchParams: Record<string, string> = {}
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<ApiResponse<T>["info"] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Створюємо URL з параметрами
        const params = new URLSearchParams({
          page: page.toString(),
          ...searchParams,
        });

        const response = await fetch(
          `https://rickandmortyapi.com/api/${endpoint}?${params}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result: ApiResponse<T> = await response.json();
        setData(result.results);
        setInfo(result.info);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, page, JSON.stringify(searchParams)]);

  const handleNextPage = () => {
    if (info?.next) {
      // Логіка для наступної сторінки
    }
  };

  const handlePrevPage = () => {
    if (info?.prev) {
      // Логіка для попередньої сторінки
    }
  };

  return {
    data,
    loading,
    error,
    info,
    handleNextPage,
    handlePrevPage,
  };
};
```

**Пояснення хука:**

- `useApi` - універсальний хук для роботи з API
- `<T>` - дженерик тип, який дозволяє використовувати хук для різних типів даних
- `useEffect` - викликається при зміні параметрів
- `URLSearchParams` - для створення URL з параметрами запиту

---

## Крок 4: Створення хука для персонажів

### Створюємо файл `src/hooks/useCharacters.ts`

```typescript
import { Character } from "@/types/character";
import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useApi } from "./useApi";

export const useCharacters = () => {
  const searchParams = useSearchParams();

  // Ініціалізуємо стани з URL параметрів
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [searchName, setSearchName] = useState(searchParams.get("name") || "");
  const [inputValue, setInputValue] = useState(searchParams.get("name") || "");
  const [filterStatus, setFilterStatus] = useState(
    searchParams.get("status") || ""
  );
  const [filterGender, setFilterGender] = useState(
    searchParams.get("gender") || ""
  );

  // Створюємо об'єкт параметрів для API
  const searchParamsObj = useMemo(
    () => ({
      ...(searchName && { name: searchName }),
      ...(filterStatus && { status: filterStatus }),
      ...(filterGender && { gender: filterGender }),
    }),
    [searchName, filterStatus, filterGender]
  );

  // Використовуємо базовий хук API
  const {
    data: characters,
    loading,
    error,
    info,
    handleNextPage,
    handlePrevPage,
  } = useApi<Character>("character", currentPage, searchParamsObj);

  // Обробники подій
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchName(inputValue);
    setCurrentPage(1); // Скидаємо на першу сторінку при пошуку
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value);
    setCurrentPage(1);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterGender(event.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchName("");
    setInputValue("");
    setFilterStatus("");
    setFilterGender("");
    setCurrentPage(1);
  };

  const handleNext = () => {
    if (info?.next) {
      setCurrentPage((prev) => prev + 1);
      handleNextPage();
    }
  };

  const handlePrev = () => {
    if (info?.prev) {
      setCurrentPage((prev) => prev - 1);
      handlePrevPage();
    }
  };

  return {
    characters,
    loading,
    error,
    info,
    currentPage,
    searchName,
    inputValue,
    filterStatus,
    filterGender,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchKeyDown,
    handleStatusChange,
    handleGenderChange,
    handleClearFilters,
    handleNextPage: handleNext,
    handlePrevPage: handlePrev,
  };
};
```

**Пояснення логіки:**

- `useSearchParams` - хук Next.js для роботи з URL параметрами
- `useMemo` - мемоізує об'єкт параметрів, щоб уникнути зайвих ре-рендерів
- Всі стани ініціалізуються з URL параметрів для збереження стану при оновленні сторінки

---

## Крок 5: Створення компонента картки персонажа

### Створюємо файл `src/components/CharactersCard.tsx`

```typescript
import { Character } from "@/types/character";
import Link from "next/link";

type CharactersCardProps = {
  character: Character;
};

export const CharactersCard = ({ character }: CharactersCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={character.image}
        alt={character.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {character.name}
        </h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium">Status:</span> {character.status}
          </p>
          <p>
            <span className="font-medium">Species:</span> {character.species}
          </p>
          <p>
            <span className="font-medium">Gender:</span> {character.gender}
          </p>
        </div>
        <Link
          href={`/character/${character.id}`}
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
```

**Пояснення компонента:**

- `CharactersCardProps` - тип для пропсів компонента
- `Link` - компонент Next.js для навігації
- Tailwind класи для стилізації картки

---

## Крок 6: Створення компонента пагінації

### Створюємо файл `src/components/Pagination.tsx`

```typescript
type PaginationProps = {
  currentPage: number;
  totalPages?: number;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
      >
        Previous
      </button>

      <span className="text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
      >
        Next
      </button>
    </div>
  );
};
```

**Пояснення компонента:**

- `disabled` атрибут для кнопок коли немає попередньої/наступної сторінки
- Tailwind класи для стилізації кнопок та станів

---

## Крок 7: Створення головної сторінки

### Створюємо файл `src/app/page.tsx`

```typescript
"use client";

import { useCharacters } from "@/hooks/useCharacters";
import { CharactersCard } from "@/components/CharactersCard";
import { Pagination } from "@/components/Pagination";

export default function Home() {
  const {
    characters,
    loading,
    error,
    info,
    currentPage,
    searchName,
    inputValue,
    filterStatus,
    filterGender,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchKeyDown,
    handleStatusChange,
    handleGenderChange,
    handleClearFilters,
    handleNextPage,
    handlePrevPage,
  } = useCharacters();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <main className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-slate-800 text-4xl font-bold my-8">
        Rick and Morty Characters
      </h1>

      {/* Секція пошуку та фільтрів */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Пошук за ім'ям */}
          <div>
            <label
              htmlFor="searchName"
              className="block text-slate-700 text-sm font-bold mb-2"
            >
              Search by Name:
            </label>
            <div className="flex">
              <input
                type="text"
                id="searchName"
                value={inputValue}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="Enter name..."
                className="shadow appearance-none border rounded-l w-full py-2 px-3 text-slate-700 focus:outline-none"
              />
              <button
                onClick={handleSearchSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Фільтр за статусом */}
          <div>
            <label
              htmlFor="filterStatus"
              className="block text-slate-700 text-sm font-bold mb-2"
            >
              Filter by Status:
            </label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={handleStatusChange}
              className="shadow border rounded w-full py-2 px-3 text-slate-700 focus:outline-none"
            >
              <option value="">All</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          {/* Фільтр за статтю */}
          <div>
            <label
              htmlFor="filterGender"
              className="block text-slate-700 text-sm font-bold mb-2"
            >
              Filter by Gender:
            </label>
            <select
              id="filterGender"
              value={filterGender}
              onChange={handleGenderChange}
              className="shadow border rounded w-full py-2 px-3 text-slate-700 focus:outline-none"
            >
              <option value="">All</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="genderless">Genderless</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleClearFilters}
            className="bg-gray-200 text-slate-700 px-4 py-2 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Сітка персонажів */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {characters.map((character) => (
          <CharactersCard key={character.id} character={character} />
        ))}
      </div>

      {/* Пагінація */}
      <Pagination
        currentPage={currentPage}
        totalPages={info?.pages}
        onNext={handleNextPage}
        onPrev={handlePrevPage}
        hasNext={!!info?.next}
        hasPrev={!!info?.prev}
      />
    </main>
  );
}
```

**Пояснення структури:**

- `"use client"` - директива для використання клієнтських хуків
- `container mx-auto` - центрування контенту
- `grid` - адаптивна сітка для карток
- Всі стани та обробники подій з хука `useCharacters`

---

## Крок 8: Створення детальної сторінки персонажа

### Створюємо файл `src/app/character/[id]/page.tsx`

```typescript
"use client";

import { useParams } from "next/navigation";
import { useSingleItem } from "@/hooks/useSingleItem";
import { Character } from "@/types/character";
import Link from "next/link";

export default function CharacterPage() {
  const params = useParams();
  const characterId = Number(params.id);

  const {
    data: character,
    loading,
    error,
  } = useSingleItem<Character>("character", characterId);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!character) {
    return <p>Character not found</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link
        href="/"
        className="inline-block mb-6 text-blue-500 hover:text-blue-700"
      >
        ← Back to Characters
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {character.name}
            </h1>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {character.status}
              </p>
              <p>
                <span className="font-semibold">Species:</span>{" "}
                {character.species}
              </p>
              <p>
                <span className="font-semibold">Gender:</span>{" "}
                {character.gender}
              </p>
              <p>
                <span className="font-semibold">Origin:</span>{" "}
                {character.origin.name}
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {character.location.name}
              </p>
              <p>
                <span className="font-semibold">Episodes:</span>{" "}
                {character.episode.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Крок 9: Створення хука для одиночного елемента

### Створюємо файл `src/hooks/useSingleItem.ts`

```typescript
import { useState, useEffect } from "react";

export const useSingleItem = <T>(endpoint: string, id: number) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/${endpoint}/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result: T = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, id]);

  return {
    data,
    loading,
    error,
  };
};
```

---

## Крок 10: Створення сторінки епізодів

### Створюємо файл `src/types/episode.ts`

```typescript
export type Episode = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
};
```

### Створюємо файл `src/components/EpisodeCard.tsx`

```typescript
import { Episode } from "@/types/episode";

type EpisodeCardProps = {
  episode: Episode;
};

export const EpisodeCard = ({ episode }: EpisodeCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {episode.name}
      </h3>
      <p className="text-gray-600 mb-2">{episode.episode}</p>
      <p className="text-gray-500 text-sm mb-3">Air Date: {episode.air_date}</p>
      <p className="text-gray-500 text-sm">
        Characters: {episode.characters.length}
      </p>
    </div>
  );
};
```

### Створюємо файл `src/hooks/useEpisodes.ts`

```typescript
import { Episode } from "@/types/episode";
import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useApi } from "./useApi";

export const useEpisodes = () => {
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [searchName, setSearchName] = useState(searchParams.get("name") || "");
  const [inputValue, setInputValue] = useState(searchParams.get("name") || "");

  const searchParamsObj = useMemo(
    () => ({
      ...(searchName && { name: searchName }),
    }),
    [searchName]
  );

  const {
    data: episodes,
    loading,
    error,
    info,
    handleNextPage,
    handlePrevPage,
  } = useApi<Episode>("episode", currentPage, searchParamsObj);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchName(inputValue);
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleNext = () => {
    if (info?.next) {
      setCurrentPage((prev) => prev + 1);
      handleNextPage();
    }
  };

  const handlePrev = () => {
    if (info?.prev) {
      setCurrentPage((prev) => prev - 1);
      handlePrevPage();
    }
  };

  return {
    episodes,
    loading,
    error,
    info,
    currentPage,
    inputValue,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchKeyDown,
    handleNextPage: handleNext,
    handlePrevPage: handlePrev,
  };
};
```

### Створюємо файл `src/app/episodes/page.tsx`

```typescript
"use client";

import { useEpisodes } from "@/hooks/useEpisodes";
import { EpisodeCard } from "@/components/EpisodeCard";
import { Pagination } from "@/components/Pagination";

export default function EpisodesPage() {
  const {
    episodes,
    loading,
    error,
    info,
    currentPage,
    inputValue,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchKeyDown,
    handleNextPage,
    handlePrevPage,
  } = useEpisodes();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <main className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-slate-800 text-4xl font-bold my-8">
        Rick and Morty Episodes
      </h1>

      {/* Секція пошуку */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8 w-full max-w-2xl">
        <div className="mb-4">
          <label
            htmlFor="searchName"
            className="block text-slate-700 text-sm font-bold mb-2"
          >
            Search by Episode Name:
          </label>
          <div className="flex">
            <input
              type="text"
              id="searchName"
              value={inputValue}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="Enter episode name..."
              className="shadow appearance-none border rounded-l w-full py-2 px-3 text-slate-700 focus:outline-none"
            />
            <button
              onClick={handleSearchSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Сітка епізодів */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
      </div>

      {/* Пагінація */}
      <Pagination
        currentPage={currentPage}
        totalPages={info?.pages}
        onNext={handleNextPage}
        onPrev={handlePrevPage}
        hasNext={!!info?.next}
        hasPrev={!!info?.prev}
      />
    </main>
  );
}
```

---

## Крок 11: Створення навігації

### Створюємо файл `src/components/Navbar.tsx`

```typescript
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Rick and Morty Wiki
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Characters
          </Link>
          <Link
            href="/episodes"
            className="hover:text-gray-300 transition-colors"
          >
            Episodes
          </Link>
        </div>
      </div>
    </nav>
  );
};
```

### Оновлюємо файл `src/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rick and Morty Wiki",
  description: "Explore characters and episodes from Rick and Morty",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

---

## Часті помилки та поради

### 1. Типізація

**Помилка:** Не типізувати пропси компонентів

```typescript
// ❌ Погано
const CharactersCard = ({ character }) => {
  return <div>{character.name}</div>;
};

// ✅ Добре
type CharactersCardProps = {
  character: Character;
};

const CharactersCard = ({ character }: CharactersCardProps) => {
  return <div>{character.name}</div>;
};
```

### 2. URL Search Params

**Помилка:** Не обробляти випадок коли параметр відсутній

```typescript
// ❌ Погано
const page = Number(searchParams.get("page"));

// ✅ Добре
const page = Number(searchParams.get("page")) || 1;
```

### 3. Обробка помилок

**Помилка:** Не обробляти помилки API

```typescript
// ❌ Погано
const response = await fetch(url);
const data = await response.json();

// ✅ Добре
const response = await fetch(url);
if (!response.ok) {
  throw new Error("Failed to fetch data");
}
const data = await response.json();
```

### 4. Мемоізація

**Помилка:** Створювати об'єкти в рендері

```typescript
// ❌ Погано
const searchParamsObj = {
  ...(searchName && { name: searchName }),
};

// ✅ Добре
const searchParamsObj = useMemo(
  () => ({
    ...(searchName && { name: searchName }),
  }),
  [searchName]
);
```

---

## Резюме

### Що ми створили:

1. **Структуру проєкту** з папками для компонентів, хуків та типів
2. **TypeScript типи** для персонажів, епізодів та API відповідей
3. **Універсальний хук useApi** для роботи з API
4. **Спеціалізовані хуки** useCharacters та useEpisodes
5. **React компоненти** для карток, пагінації та навігації
6. **Сторінки** з пошуком, фільтрацією та пагінацією

### Концепції які вивчили:

- **Next.js App Router** - файлова система роутингу
- **TypeScript дженерики** - для універсальних хуків
- **URL Search Params** - робота з параметрами URL
- **React Hooks** - useState, useEffect, useMemo
- **Tailwind CSS** - утилітарні класи для стилізації
- **Компонентна архітектура** - розділення логіки та UI

### Наступні кроки для розвитку:

1. Додати тести (Jest + React Testing Library)
2. Додати анімації (Framer Motion)
3. Додати кешування (React Query)
4. Додати SEO оптимізацію
5. Додати PWA функціональність
