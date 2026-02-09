import { useRef, useMemo, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowUpDown, Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CsvColumn, generateMockRows, formatNumber } from '@/lib/mock-data';

interface DataTableProps {
  schema: CsvColumn[];
  totalRows: number;
}

const VISIBLE_ROWS = 500;

const DataTable = ({ schema, totalRows }: DataTableProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [columnSearch, setColumnSearch] = useState('');
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 100;

  const data = useMemo(() => generateMockRows(VISIBLE_ROWS, schema), [schema]);

  const filteredCols = useMemo(() => {
    if (!columnSearch) return schema.map((_, i) => i);
    return schema.reduce<number[]>((acc, col, i) => {
      if (col.name.toLowerCase().includes(columnSearch.toLowerCase())) acc.push(i);
      return acc;
    }, []);
  }, [schema, columnSearch]);

  const pagedData = useMemo(() => {
    return data.slice(page * pageSize, (page + 1) * pageSize);
  }, [data, page]);

  const rowVirtualizer = useVirtualizer({
    count: pagedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 20,
  });

  const totalPages = Math.ceil(VISIBLE_ROWS / pageSize);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-3 border-b border-border">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter columns..."
            value={columnSearch}
            onChange={e => setColumnSearch(e.target.value)}
            className="h-8 pl-8 text-xs bg-secondary/50 border-border/50"
          />
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs border-border/50 text-muted-foreground">
          <Filter className="w-3.5 h-3.5 mr-1.5" /> Filters
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs border-border/50 text-muted-foreground">
          <Download className="w-3.5 h-3.5 mr-1.5" /> Export
        </Button>
        <div className="ml-auto text-xs text-muted-foreground">
          Showing <span className="text-foreground font-medium">{formatNumber(pageSize)}</span> of{' '}
          <span className="text-primary font-medium">{formatNumber(totalRows)}</span> rows
        </div>
      </div>

      {/* Table */}
      <div ref={parentRef} className="flex-1 overflow-auto">
        <table className="w-full border-collapse min-w-max">
          <thead className="sticky top-0 z-10">
            <tr className="bg-secondary/80 backdrop-blur-sm">
              <th className="w-16 px-3 py-2 text-xs font-medium text-muted-foreground text-left border-b border-border">#</th>
              {filteredCols.map(colIdx => (
                <th
                  key={colIdx}
                  className="px-3 py-2 text-xs font-medium text-left border-b border-border cursor-pointer hover:bg-muted/50 transition-colors group"
                  onClick={() => setSortCol(sortCol === colIdx ? null : colIdx)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground">{schema[colIdx].name}</span>
                    <span className="text-muted-foreground/50 text-mono text-[10px]">{schema[colIdx].type}</span>
                    <ArrowUpDown className="w-3 h-3 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
              const rowIdx = virtualRow.index;
              const row = pagedData[rowIdx];
              return (
                <tr
                  key={rowIdx}
                  className="hover:bg-muted/30 transition-colors border-b border-border/30"
                >
                  <td className="px-3 py-1.5 text-xs text-muted-foreground/50 font-mono">
                    {page * pageSize + rowIdx + 1}
                  </td>
                  {filteredCols.map(colIdx => (
                    <td key={colIdx} className="px-3 py-1.5 text-xs text-foreground/90 font-mono whitespace-nowrap max-w-48 truncate">
                      {row[colIdx]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-secondary/30">
        <span className="text-xs text-muted-foreground">
          Page {page + 1} of {totalPages}
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-3 border-border/50"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-3 border-border/50"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
