"use client";

import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "./Pagination";
import { DataTableProps } from "./types";

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
}: DataTableProps<TData>) {
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
                  {headers.map((header, index) => (
                    <TableHead key={index} className={index === headers.length - 1 ? "text-right" : ""}>
                      {header}
                    </TableHead>
                  ))}
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
