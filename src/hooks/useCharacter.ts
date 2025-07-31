import { Character } from "@/types/character";
import { useEffect, useState } from "react";

export const useCharacter = (characterId: string | string[] | undefined) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!characterId) {
      setLoading(false);
      setError("Character ID is missing.");
      return;
    }

    setLoading(true);
    setError(null);
    setCharacter(null);

    const fetchCharacterDetails = async () => {
      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/${characterId}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch character: ${response.status} ${response.statusText}`
          );
        }

        const data: Character = await response.json();
        setCharacter(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterDetails();
  }, [characterId]);

  return { character, loading, error };
};
