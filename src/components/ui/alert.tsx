import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "default" | "success" | "warning" | "destructive" | "info";
  title?: string;
  description: string | ReactNode;
  icon?: LucideIcon;
  className?: string;
}

const variantStyles = {
  default: "bg-muted/50 border-border text-foreground",
  success:
    "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50 text-green-800 dark:text-green-200",
  warning:
    "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200",
  destructive:
    "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200",
  info: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-200",
};

const iconColorStyles = {
  default: "text-foreground",
  success: "text-green-600 dark:text-green-500",
  warning: "text-amber-600 dark:text-amber-500",
  destructive: "text-red-600 dark:text-red-500",
  info: "text-blue-600 dark:text-blue-500",
};

export function Alert({
  variant = "default",
  title,
  description,
  icon: Icon,
  className,
}: AlertProps) {
  return (
    <div
      className={cn(
        "p-3 rounded-lg border",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start gap-2">
        {Icon && (
          <Icon
            className={cn(
              "h-4 w-4 mt-0.5 shrink-0",
              iconColorStyles[variant]
            )}
          />
        )}
        <div className="text-xs flex-1">
          {title && <strong className="block mb-1">{title}</strong>}
          {typeof description === "string" ? <p>{description}</p> : description}
        </div>
      </div>
    </div>
  );
}
