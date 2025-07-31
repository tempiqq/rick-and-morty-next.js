"use client";

import { useCharacters } from "@/hooks/useCharacters";
import { CharactersCard } from "@/components/CharactersCard";
import { AutocompleteInput } from "@/components/AutocompleteInput";
import { Suspense } from "react";

function HomeContent() {
  const {
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
  } = useCharacters();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: ${error}</p>;
  }

  return (
    <main className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-slate-800 text-4xl font-bold my-8">
        Rick and Morty Characters
      </h1>

      {/* Секція пошуку та фільтрів */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Пошук за ім'ям з автодоповненням */}
          <AutocompleteInput
            value={searchName}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            suggestionsLoading={suggestionsLoading}
            placeholder="Введіть ім'я персонажа..."
            id="searchName"
            label="Search by Name"
          />

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {characters.map((character) => (
          <CharactersCard key={character.id} character={character} />
        ))}
      </div>

      <div className="flex justify-center items-center space-x-4 my-8">
        <button
          onClick={handlePrevPage}
          disabled={!info?.prev}
          className="flex justify-center items-center w-20 h-10 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          Previous
        </button>
        <span className="text-l font-medium text-slate-800">
          Page {currentPage} of {info?.pages || "..."}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!info?.next}
          className="flex justify-center items-center w-20 h-10 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          Next
        </button>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <HomeContent />
    </Suspense>
  );
}
