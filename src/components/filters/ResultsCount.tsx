interface ResultsCountProps {
  total: number;
  filtered: number;
}

export function ResultsCount({ total, filtered }: ResultsCountProps) {
  const isFiltered = total !== filtered;
  
  return (
    <div className="text-sm text-muted-foreground ml-auto" role="status" aria-live="polite">
      {isFiltered ? (
        <>
          <span className="font-medium text-foreground">{filtered}</span> de {total}
        </>
      ) : (
        <span className="font-medium text-foreground">{total}</span>
      )}
      {" "}resultados
    </div>
  );
}
