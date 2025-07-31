import { Character, Info } from "@/types/character";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/api";

export const useCharacters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<Info | null>(null);

  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get("page")) || 1
  );

  const [searchName, setSearchName] = useState(
    () => searchParams.get("name") || ""
  );
  const [filterStatus, setFilterStatus] = useState(
    () => searchParams.get("status") || ""
  );
  const [filterGender, setFilterGender] = useState(
    () => searchParams.get("gender") || ""
  );

  // Функція для отримання підказок
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const response = await api.getCharacters({ name: query });

      if (response.data && !response.error) {
        setSuggestions(response.data.results.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  // Debounced пошук підказок
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchName);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchName, fetchSuggestions]);

  // Функція запиту API
  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (searchName) params.set("name", searchName);
    if (filterStatus) params.set("status", filterStatus);
    if (filterGender) params.set("gender", filterGender);
    if (currentPage > 1) params.set("page", String(currentPage));

    const queryString = params.toString();
    router.push(`/?${queryString}`, { scroll: false });

    try {
      const response = await api.getCharacters({
        name: searchName || undefined,
        status: filterStatus || undefined,
        gender: filterGender || undefined,
        page: currentPage > 1 ? currentPage : undefined,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setCharacters(response.data.results);
        setInfo(response.data.info);
      } else {
        setCharacters([]);
        setInfo(null);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setCharacters([]);
      setInfo(null);
    } finally {
      setLoading(false);
    }
  }, [searchName, filterStatus, filterGender, currentPage, router]);

  // Завантаження з API
  useEffect(() => {
    fetchCharacters();
  }, [filterStatus, filterGender, currentPage]);

  // Пагінація
  const handleNextPage = () => {
    if (info?.next) {
      setCurrentPage((prevPage) => prevPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (info?.prev) {
      setCurrentPage((prevPage) => prevPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Фільтрація
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchName(value);
    setCurrentPage(1);

    if (!value.trim()) {
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowSuggestions(false);
    fetchCharacters();
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
    setFilterStatus("");
    setFilterGender("");
    setCurrentPage(1);
    setShowSuggestions(false);
    router.replace("/");
  };

  return {
    characters,
    loading,
    error,
    info,
    currentPage,
    searchName,
    filterStatus,
    filterGender,
    suggestions,
    showSuggestions,
    suggestionsLoading,
    handleSearchChange,
    handleSearchSubmit,
    handleStatusChange,
    handleGenderChange,
    handleClearFilters,
    handleNextPage,
    handlePrevPage,
  };
};
