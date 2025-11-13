import { LucideIcon } from "lucide-react";

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface EmptyStateConfig {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export interface DataTableProps<TData> {
  data: TData[];
  headers: string[];
  renderRow: (item: TData) => React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  emptyState?: EmptyStateConfig;
  pagination?: PaginationConfig;
  cardTitle?: string;
  cardDescription?: string;
}
