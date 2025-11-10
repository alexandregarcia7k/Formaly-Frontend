import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FieldWrapperProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: ReactNode;
}

export function FieldWrapper({
  label,
  htmlFor,
  required = false,
  error,
  description,
  children,
}: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
