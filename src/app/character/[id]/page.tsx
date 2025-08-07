"use client";

import { Character } from "@/types/character";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSingleItem } from "@/hooks/useSingleItem";

export default function CharactersInfoPage() {
  const params = useParams();
  const {
    data: character,
    loading,
    error,
  } = useSingleItem<Character>("character", params.id as string);

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
    <main className="container mx-auto p-4 min-h-screen">
      <div className="flex text-center mb-4">
        
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors duration-200"
        >
          Back to Characters
        </Link>
      </div>
      <h1 className="text-4xl font-bold text-center text-slate-700  my-2">
        {character.name}
      </h1>
      
      

      <div className="flex flex-col items-center justify-center gap-8 bg-white/30 p-6 rounded-lg w-full">
        
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
