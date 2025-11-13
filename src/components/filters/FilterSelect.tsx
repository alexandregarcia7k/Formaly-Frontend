import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FilterOption } from "./types";

interface FilterSelectProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  hasActiveFilter?: boolean;
}

export function FilterSelect({ label, options, value, onChange, hasActiveFilter }: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        {hasActiveFilter && (
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-label="Filtro ativo" />
        )}
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]" aria-label={`Filtrar por ${label.toLowerCase()}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
