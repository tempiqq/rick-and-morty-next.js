import Link from "next/link";
import type { Episode } from "@/types/episode";

type EpisodeCardProps = {
  episode: Episode;
};

export const EpisodeCard = ({ episode }: EpisodeCardProps) => {
  return (
    <Link href={`/episodes/${episode.id}`} className="block">
      <div className="p-6 flex flex-col justify-between h-full cursor-pointer border hover:scale-110 transition-transform duration-300">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          {episode.name}
        </h2>
        <p className="text-sm text-gray-600 mb-1">
          <span>Episode:</span> {episode.episode}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span>Air Date:</span> {episode.air_date}
        </p>
      </div>
    </Link>
  );
};
