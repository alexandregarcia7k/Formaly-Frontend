import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClearFiltersButtonProps {
  onClear: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}

export function ClearFiltersButton({ onClear, disabled, "aria-label": ariaLabel }: ClearFiltersButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onClear} disabled={disabled} className="h-10" aria-label={ariaLabel}>
      <X className="mr-2 h-4 w-4" />
      Limpar
    </Button>
  );
}
