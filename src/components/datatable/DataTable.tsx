"use client";

import { Loader2, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "./Pagination";
import { DataTableProps, HeaderConfig } from "./types";
import { cn } from "@/lib/utils";

export function DataTable<TData>({
  data,
  headers,
  renderRow,
  isLoading,
  error,
  emptyState,
  pagination,
  cardTitle,
  cardDescription,
  sortConfig,
  onSort,
}: DataTableProps<TData>) {
  const isHeaderConfig = (header: string | HeaderConfig): header is HeaderConfig => {
    return typeof header === "object" && "label" in header;
  };

  const getSortIcon = (sortKey?: string) => {
    if (!sortKey || !sortConfig || sortConfig.key !== sortKey) {
      return <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />;
    }
    if (sortConfig.direction === "asc") {
      return <ArrowUp className="ml-2 h-3.5 w-3.5 text-primary" />;
    }
    if (sortConfig.direction === "desc") {
      return <ArrowDown className="ml-2 h-3.5 w-3.5 text-primary" />;
    }
    return <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />;
  };
  return (
    <Card>
      {(cardTitle || cardDescription) && (
        <CardHeader>
          {cardTitle && <CardTitle>{cardTitle}</CardTitle>}
          {cardDescription && <CardDescription>{cardDescription}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {isLoading ? (
          <EmptyState
            icon={Loader2}
            title="Carregando..."
            variant="default"
            className="border-0"
          />
        ) : error ? (
          <EmptyState
            icon={AlertCircle}
            title="Erro ao carregar dados"
            description={error}
            variant="default"
            className="border-0"
          />
        ) : data.length === 0 && emptyState ? (
          <EmptyState
            icon={emptyState.icon}
            title={emptyState.title}
            description={emptyState.description}
            variant="dashed"
            action={emptyState.action}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => {
                    const isLast = index === headers.length - 1;
                    const headerConfig = isHeaderConfig(header) ? header : { label: header };
                    const isSortable = headerConfig.sortKey && onSort;
                    const isActive = sortConfig?.key === headerConfig.sortKey;

                    return (
                      <TableHead 
                        key={index} 
                        className={cn(
                          isLast && "text-right",
                          isSortable && "cursor-pointer select-none hover:bg-muted/50 transition-colors"
                        )}
                        onClick={() => isSortable && onSort(headerConfig.sortKey!)}
                      >
                        <div className={cn(
                          "flex items-center",
                          isLast && "justify-end",
                          isActive && "text-primary font-semibold"
                        )}>
                          {headerConfig.label}
                          {isSortable && getSortIcon(headerConfig.sortKey)}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    {renderRow(item)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {pagination && <Pagination config={pagination} />}
          </>
        )}
      </CardContent>
    </Card>
  );
}
