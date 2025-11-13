import { Calendar as CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dateRangeSchema } from "@/schemas";

interface DateRangeFilterProps {
  value: { from?: Date; to?: Date };
  onChange: (value: { from?: Date; to?: Date } | undefined) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const hasActiveFilter = !!value.from;
  const displayValue = value?.from
    ? value.to
      ? `${format(value.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(value.to, "dd/MM/yyyy", { locale: ptBR })}`
      : format(value.from, "dd/MM/yyyy", { locale: ptBR })
    : "";

  const handleInputChange = (inputValue: string) => {
    if (!inputValue) {
      onChange(undefined);
      return;
    }

    const parts = inputValue.split("-").map(s => s.trim());
    
    try {
      if (parts.length === 2) {
        const from = parse(parts[0], "dd/MM/yyyy", new Date());
        const to = parse(parts[1], "dd/MM/yyyy", new Date());
        
        if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
          // Valida com Zod
          const result = dateRangeSchema.safeParse({ from, to });
          
          if (result.success) {
            onChange(result.data);
          } else {
            toast.error(result.error.errors[0].message);
          }
        }
      } else if (parts.length === 1) {
        const date = parse(parts[0], "dd/MM/yyyy", new Date());
        
        if (!isNaN(date.getTime())) {
          // Valida apenas a data inicial
          const result = dateRangeSchema.safeParse({ from: date });
          
          if (result.success) {
            onChange({ from: result.data.from });
          } else {
            toast.error(result.error.errors[0].message);
          }
        }
      }
    } catch {
      // Ignora erros de parsing
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Período</Label>
        {hasActiveFilter && (
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        )}
      </div>
      <div className="relative w-[240px]">
        <Input
          placeholder="dd/mm/aaaa - dd/mm/aaaa"
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pr-10"
        />
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={value.from ? value as any : undefined}
              onSelect={onChange}
              locale={ptBR}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
