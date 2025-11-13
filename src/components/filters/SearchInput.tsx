import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export function SearchInput({ label, placeholder = "Buscar...", value, onChange, inputRef, "aria-label": ariaLabel, "aria-describedby": ariaDescribedby }: SearchInputProps) {
  return (
    <div className="flex flex-col gap-2 flex-1 max-w-sm">
      {label && <Label className="text-xs font-medium text-muted-foreground">{label}</Label>}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
        />
      </div>
    </div>
  );
}
