import { Character } from "@/types/character";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type CharactersCardProps = {
  character: Character;
};

export const CharactersCard = ({ character }: CharactersCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "alive":
        return "text-green-500";
      case "dead":
        return "text-red-500";
      default:
        return "text-slate-600";
    }
  };

  return (
    <Link
      href={`/character/${character.id}`}
      className="block border-4 border-blue-500/50 relative "
    >
      <div key={character.id}>
        <Image
          src={character.image}
          alt={character.name}
          width={300}
          height={300}
          className="border-b-4 border-blue-500/50"
        />
        <div className="bg-white/30 space-y-2 p-2">
          <h2 className="text-xl font-semibold text-slate-800">
            {character.name}
          </h2>
          <span
            className={`${getStatusColor(
              character.status
            )} font-medium absolute -top-0.5 right-1 bg-white rounded-md px-2`}
          >
            {character.status}
          </span>
          <p className="text-slate-600">Species: {character.species}</p>
        </div>
      </div>
    </Link>
  );
};
