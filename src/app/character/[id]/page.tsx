"use client";

import { useCharacter } from "@/hooks/useCharacter";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function CharactersInfoPage() {
  const params = useParams();
  const router = useRouter();
  const { character, loading, error } = useCharacter(params.id);

  if (loading) {
    return (
      <p className="text-xl text-blue-500">Loading character details...</p>
    );
  }

  if (error) {
    return <p className="text-xl text-red-500">Error: {error}</p>;
  }

  if (!character) {
    return (
      <main className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Character not found.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-slate-600 my-8">
        {character.name}
      </h1>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.back()}
          className="w-32 h-10 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-200"
        >
          Back
        </button>
      </div>

      <div className="flex flex-col items-center gap-8 bg-slate-100 p-6 rounded-lg">
        <Image
          src={character.image}
          alt={character.name}
          width={300}
          height={300}
          className="rounded-lg shadow-md"
        />
        <div className="flex-1">
          <p className="text-lg mb-2">
            <span className="font-semibold">Status:</span> {character.status}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Species:</span> {character.species}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Type:</span>{" "}
            {character.type || "N/A"}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Gender:</span> {character.gender}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Origin:</span>{" "}
            {character.origin.name}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Location:</span>{" "}
            {character.location.name}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">First seen in:</span>{" "}
            {character.episode[0]
              ? `Episode ${character.episode[0].split("/").pop()}`
              : "N/A"}
          </p>
        </div>
      </div>
    </main>
  );
}
