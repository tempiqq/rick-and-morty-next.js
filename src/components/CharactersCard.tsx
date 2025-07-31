import { Character } from "@/types/character";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type CharactersCardProps = {
  character: Character;
};

export const CharactersCard: React.FC<CharactersCardProps> = ({
  character,
}) => {
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
    <Link href={`/character/${character.id}`} className="block">
      <div key={character.id} className="">
        <Image
          src={character.image}
          alt={character.name}
          width={300}
          height={300}
          className="border-4 border-blue-500"
        />
        <h2 className="text-xl font-semibold text-slate-800">
          {character.name}
        </h2>
        <p className="text-slate-600">
          Status:{" "}
          <span className={`${getStatusColor(character.status)} font-medium`}>
            {character.status}
          </span>
        </p>
        <p className="text-slate-600">Species: {character.species}</p>
      </div>
    </Link>
  );
};
