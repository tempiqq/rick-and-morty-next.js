// src/hooks/useEpisodes.ts
"use client";

import { Episode } from "@/types/episode";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Info } from "@/types/common";
import { getEpisodes } from "@/api/episodesApi";

export const useEpisodes = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<Info | null>(null);

  const [selectedSeason, setSelectedSeason] = useState("");
  const filteredEpisodes = selectedSeason
    ? episodes.filter((ep) => ep.episode.startsWith(`S0${selectedSeason}`))
    : episodes;

  const fetchEpisodes = async (page: number, reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEpisodes(page);
      if (reset) {
        setEpisodes(result.results);
      } else {
        setEpisodes((prev) => {
          const existingIds = new Set(prev.map((e: Episode) => e.id));
          const newEpisodes = result.results.filter(
            (e: Episode) => !existingIds.has(e.id)
          );
          return [...prev, ...newEpisodes];
        });
      }
      setInfo(result.info);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEpisodes([]);
    fetchEpisodes(1, true);
    setCurrentPage(1);
  }, []);

  const loadMore = () => {
    if (info?.next) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchEpisodes(nextPage);
    }
  };

  return {
    episodes,
    loading,
    error,
    info,
    currentPage,
    loadMore,

    selectedSeason,
    setSelectedSeason,
    filteredEpisodes,
  };
};
