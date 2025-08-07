"use client";
import { useCharacters } from "@/hooks/useCharacters";
import { CharactersCard } from "@/components/CharactersCard";
import { Pagination } from "@/components/Pagination";

export default function HomePageContent() {
  const {
    characters,
    loading,
    error,
    info,
    currentPage,
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
    return <p>Error: ${error}</p>;
  }

  return (
    <main className="w-full container mx-auto p-4 flex flex-col items-center ">
      <h1 className="text-slate-800 text-4xl font-bold my-8">
        Rick and Morty Characters
      </h1>

      {/* фільтри */}
      <div className="w-full max-w-7xl bg-white/30 p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* за ім'ям */}
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
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-slate-700 focus:outline-none"
              />
              <button
                onClick={handleSearchSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* за статусом */}
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

          {/* за статтю */}
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
            className="bg-white text-slate-700 px-4 py-2 font-semibold rounded-lg shadow-md hover:bg-gray-400 hover:text-white/80 transition"
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
