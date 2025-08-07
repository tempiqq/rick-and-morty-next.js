"use client";

import { useEpisodes } from "@/hooks/useEpisodes";
import { useRouter } from "next/navigation";

export default function EpisodesPage() {
  const {
    episodes,
    loading,
    error,
    info,

    loadMore,

    selectedSeason,
    setSelectedSeason,
    filteredEpisodes,
  } = useEpisodes();

  const router = useRouter();

  if (loading && episodes.length === 0) {
    return (
      <main className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <p className="text-xl text-blue-500">Loading episodes...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">Error: {error}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl text-slate-800 font-bold my-8">Episodes</h1>
      {/* фільтри */}
      <div className="bg-white/30 p-6 rounded-lg mb-8">
        <div>
          {/* за сезоном */}
          <div>
            <label
              htmlFor="filterSeason"
              className="block text-slate-700 text-sm font-bold mb-2"
            >
              Filter by Season:
            </label>
            <select
              id="filterSeason"
              className="shadow border rounded w-full py-2 px-3 text-slate-700 focus:outline-none mb-2"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
            >
              <option value="">All</option>
              <option value="1">Season 1</option>
              <option value="2">Season 2</option>
              <option value="3">Season 3</option>
              <option value="4">Season 4</option>
              <option value="5">Season 5</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setSelectedSeason("")}
              className="bg-white text-slate-700 px-4 py-2 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* таблиця */}
      <table className="min-w-full divide-y divide-gray-400 mb-8 border border-gray-400 ">
        <thead className="bg-blue-400 text-white">
          <tr className="border-b-2 border-gray-400">
            <th className="px-6 py-4 text-left font-bold uppercase">Episode</th>
            <th className="px-6 py-4 text-left font-bold uppercase">Name</th>
            <th className="px-6 py-4 text-left font-bold uppercase">
              Air Date
            </th>
            <th className="px-6 py-4 text-left font-bold uppercase">
              Characters
            </th>
          </tr>
        </thead>
        <tbody className="bg-white/30 divide-y divide-gray-400">
          {filteredEpisodes.map((episode) => {
            const episodeNumber = episode.episode.match(/E(\d+)/)?.[1] || "";
            const seasonNumber = episode.episode.match(/S(\d+)/)?.[1] || "";

            return (
              <tr
                key={episode.id}
                className="hover:bg-gray-100/70 cursor-pointer transition-colors duration-150 "
                onClick={() => router.push(`/episodes/${episode.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-blue-600 px-2 py-1 rounded">
                    {episode.episode}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {episode.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Season {seasonNumber} • Episode {episodeNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {episode.air_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {episode.characters.length} characters
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Load More Button */}
      {info?.next && (
        <div className="flex justify-center my-8">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* список серій  */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
      </div> */}
    </main>
  );
}
