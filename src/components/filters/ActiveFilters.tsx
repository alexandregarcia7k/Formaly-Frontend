import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
}

export function ActiveFilters({ filters, onRemove }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="gap-1 pr-1">
          <span className="text-xs">
            {filter.label}: {filter.value}
          </span>
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={() => onRemove(filter.key)}
          />
        </Badge>
      ))}
    </div>
  );
}
