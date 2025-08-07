import { useState, useEffect } from "react";

export const useSingleItem = <T>(endpoint: string, id: string | string[]) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID is missing.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    const fetchItem = async () => {
      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/${endpoint}/${id}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const result: T = await response.json();
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [endpoint, id]);

  return { data, loading, error };
};
