"use client";

import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { SearchProps } from "@/type/type";

export default function Search({ value, onChange }: SearchProps) {
  return (
    <div className="relative w-full">
      <SearchIcon
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <Input
        type="text"
        placeholder="Search by course name, code, or lecturer..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="pl-10 py-5 rounded-xl"
      />
    </div>
  );
}
