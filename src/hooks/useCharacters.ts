import { Character } from "@/types/character";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { getCharacters } from "@/api/charactersApi";

export const useCharacters = () => {
  const searchParams = useSearchParams();

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

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<any>(null);

  const searchParamsObj = useMemo(
    () => ({
      ...(searchName && { name: searchName }),
      ...(filterStatus && { status: filterStatus }),
      ...(filterGender && { gender: filterGender }),
    }),
    [searchName, filterStatus, filterGender]
  );

  const fetchCharacters = async (page: number, params: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCharacters(page, params);
      setCharacters(result.results);
      setInfo(result.info);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(currentPage, searchParamsObj);
  }, [currentPage, searchParamsObj]);

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
    }
  };

  const handlePrev = () => {
    if (info?.prev) {
      setCurrentPage((prev) => prev - 1);
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
