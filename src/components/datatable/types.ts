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

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
  key: string | null;
  direction: SortDirection;
}

export interface HeaderConfig {
  label: string;
  sortKey?: string;
}

export interface DataTableProps<TData> {
  data: TData[];
  headers: string[] | HeaderConfig[];
  renderRow: (item: TData) => React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  emptyState?: EmptyStateConfig;
  pagination?: PaginationConfig;
  cardTitle?: string;
  cardDescription?: string;
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
}
