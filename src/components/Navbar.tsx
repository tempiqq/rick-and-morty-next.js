import React from "react";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="bg-white/30 text-slate-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Rick & Morty <span className="text-blue-400">Wiki</span>
        </Link>
        <div className="space-x-4">
          <Link
            href="/"
            className="relative font-medium group"
          >
            Characters
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-400/70 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/episodes"
            className="relative font-medium group"
          >
            Episodes
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-400/70 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>
      </div>
    </nav>
  );
};
