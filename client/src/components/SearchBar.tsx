import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mode?: "text" | "semantic";
  onModeChange?: (mode: "text" | "semantic") => void;
}

export function SearchBar({ value, onChange, placeholder = "Search articles...", mode = "text", onModeChange }: SearchBarProps) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="relative w-full max-w-2xl flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 pr-10 py-3 text-base rounded-lg border-input focus-visible:ring-ring w-full"
          data-testid="input-search"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleClear}
            data-testid="button-clear-search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <select 
        aria-label="Search mode"
        value={mode}
        onChange={(e) => onModeChange && onModeChange(e.target.value as "text" | "semantic")}
        className="min-w-[100px] h-11 rounded-md border border-input bg-background px-3 text-sm focus:ring-ring"
        data-testid="select-search-mode"
      >
        <option value="text">Text</option>
        <option value="semantic">Semantic</option>
      </select>
    </div>
  );
}
