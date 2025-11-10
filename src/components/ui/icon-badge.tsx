import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconBadgeProps {
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning" | "destructive" | "muted";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles = {
  primary: "bg-primary/10 text-primary",
  success: "bg-green-500/10 text-green-600 dark:text-green-500",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
  destructive: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
};

const sizeStyles = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

const iconSizeStyles = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function IconBadge({
  icon: Icon,
  variant = "primary",
  size = "md",
  className,
}: IconBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <Icon className={iconSizeStyles[size]} />
    </div>
  );
}
