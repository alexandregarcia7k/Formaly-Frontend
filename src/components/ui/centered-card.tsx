import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CenteredCardProps {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  children: ReactNode;
  className?: string;
}

const maxWidthStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};

export function CenteredCard({
  maxWidth = "3xl",
  children,
  className,
}: CenteredCardProps) {
  return (
    <div className={cn("h-full overflow-y-auto p-6 bg-muted/30", className)}>
      <div className={cn("mx-auto", maxWidthStyles[maxWidth])}>{children}</div>
    </div>
  );
}
