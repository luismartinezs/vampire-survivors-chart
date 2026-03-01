import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="sticky top-0 z-20 bg-primary-800 py-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search items... (fuzzy match)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-primary-900 border border-primary-700 rounded-md text-sm text-white placeholder:text-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-white"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
