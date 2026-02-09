import { FileSpreadsheet, Clock, Hash, Columns3, Type, HardDrive, Globe } from 'lucide-react';
import { DatasetMetadata, formatBytes, formatNumber } from '@/lib/mock-data';

interface MetadataPanelProps {
  metadata: DatasetMetadata;
}

const MetadataPanel = ({ metadata }: MetadataPanelProps) => {
  const stats = [
    { icon: Hash, label: 'Total Rows', value: formatNumber(metadata.rows), accent: true },
    { icon: Columns3, label: 'Columns', value: metadata.columns.toString() },
    { icon: HardDrive, label: 'File Size', value: formatBytes(metadata.size) },
    { icon: Type, label: 'Delimiter', value: metadata.delimiter === ',' ? 'Comma (,)' : metadata.delimiter },
    { icon: Globe, label: 'Encoding', value: metadata.encoding },
    { icon: Clock, label: 'Modified', value: new Date(metadata.lastModified).toLocaleDateString() },
  ];

  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <FileSpreadsheet className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Dataset Info</h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map(stat => (
          <div key={stat.label} className="bg-secondary/50 rounded-md p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <stat.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">{stat.label}</span>
            </div>
            <p className={`text-sm font-semibold font-mono ${stat.accent ? 'text-primary' : 'text-foreground'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetadataPanel;
