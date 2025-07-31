import { Character } from "@/types/character";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface AutocompleteInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  suggestions: Character[];
  showSuggestions: boolean;
  suggestionsLoading: boolean;
  placeholder: string;
  id: string;
  label: string;
}

export const AutocompleteInput = ({
  value,
  onChange,
  onSubmit,
  suggestions,
  showSuggestions,
  suggestionsLoading,
  placeholder,
  id,
  label,
}: AutocompleteInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-slate-700 text-sm font-bold mb-2"
      >
        {label}:
      </label>
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="text"
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="shadow border rounded w-full py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      {isFocused && showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md  max-h-60 overflow-y-auto">
          {suggestionsLoading ? (
            <div className="px-4 py-2 text-gray-500 text-sm">loading...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <Link
                key={suggestion.id}
                href={`/character/${suggestion.id}`}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={suggestion.image}
                    alt={suggestion.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-slate-800">
                      {suggestion.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {suggestion.status} • {suggestion.species}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No results
            </div>
          )}
        </div>
      )}
    </div>
  );
};
