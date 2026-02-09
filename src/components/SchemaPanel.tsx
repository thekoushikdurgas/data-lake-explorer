import { Braces, Check, X } from 'lucide-react';
import { CsvColumn } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

interface SchemaPanelProps {
  schema: CsvColumn[];
}

const typeColors: Record<string, string> = {
  string: 'bg-info/10 text-info border-info/20',
  number: 'bg-success/10 text-success border-success/20',
  date: 'bg-warning/10 text-warning border-warning/20',
  boolean: 'bg-primary/10 text-primary border-primary/20',
  mixed: 'bg-destructive/10 text-destructive border-destructive/20',
};

const SchemaPanel = ({ schema }: SchemaPanelProps) => {
  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Braces className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Schema</h3>
        <Badge variant="secondary" className="text-[10px] ml-auto">{schema.length} columns</Badge>
      </div>

      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {schema.map(col => (
          <div key={col.name} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary/50 transition-colors text-xs">
            <span className="font-mono text-foreground/90 flex-1 truncate">{col.name}</span>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border ${typeColors[col.type] || ''}`}>
              {col.type}
            </Badge>
            {col.nullable ? (
              <span title="Nullable"><X className="w-3 h-3 text-muted-foreground/40" /></span>
            ) : (
              <span title="Not null"><Check className="w-3 h-3 text-success/60" /></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaPanel;
