export interface S3Node {
  id: string;
  name: string;
  type: 'folder' | 'file';
  path: string;
  size?: number;
  lastModified?: string;
  children?: S3Node[];
}

export interface CsvColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'mixed';
  nullable: boolean;
  sampleValues: string[];
}

export interface DatasetMetadata {
  fileName: string;
  path: string;
  size: number;
  rows: number;
  columns: number;
  delimiter: string;
  encoding: string;
  lastModified: string;
  schema: CsvColumn[];
}

export const s3Tree: S3Node[] = [
  {
    id: '1', name: 'data-lake', type: 'folder', path: 's3://acme-analytics/data-lake',
    children: [
      {
        id: '1-1', name: 'raw', type: 'folder', path: 's3://acme-analytics/data-lake/raw',
        children: [
          { id: '1-1-1', name: 'transactions_2024.csv', type: 'file', path: 's3://acme-analytics/data-lake/raw/transactions_2024.csv', size: 2_400_000_000, lastModified: '2024-12-15T08:30:00Z' },
          { id: '1-1-2', name: 'user_events.csv', type: 'file', path: 's3://acme-analytics/data-lake/raw/user_events.csv', size: 890_000_000, lastModified: '2024-12-20T14:22:00Z' },
          { id: '1-1-3', name: 'clickstream_q4.csv', type: 'file', path: 's3://acme-analytics/data-lake/raw/clickstream_q4.csv', size: 5_100_000_000, lastModified: '2025-01-02T09:15:00Z' },
        ]
      },
      {
        id: '1-2', name: 'processed', type: 'folder', path: 's3://acme-analytics/data-lake/processed',
        children: [
          { id: '1-2-1', name: 'aggregated_metrics.csv', type: 'file', path: 's3://acme-analytics/data-lake/processed/aggregated_metrics.csv', size: 45_000_000, lastModified: '2025-01-10T11:00:00Z' },
          { id: '1-2-2', name: 'user_segments.csv', type: 'file', path: 's3://acme-analytics/data-lake/processed/user_segments.csv', size: 120_000_000, lastModified: '2025-01-08T16:45:00Z' },
        ]
      },
      {
        id: '1-3', name: 'ml-features', type: 'folder', path: 's3://acme-analytics/data-lake/ml-features',
        children: [
          { id: '1-3-1', name: 'training_set_v3.csv', type: 'file', path: 's3://acme-analytics/data-lake/ml-features/training_set_v3.csv', size: 3_200_000_000, lastModified: '2025-01-12T07:30:00Z' },
          { id: '1-3-2', name: 'embeddings_output.csv', type: 'file', path: 's3://acme-analytics/data-lake/ml-features/embeddings_output.csv', size: 780_000_000, lastModified: '2025-01-11T20:00:00Z' },
        ]
      },
    ]
  },
  {
    id: '2', name: 'reports', type: 'folder', path: 's3://acme-analytics/reports',
    children: [
      { id: '2-1', name: 'monthly_revenue.csv', type: 'file', path: 's3://acme-analytics/reports/monthly_revenue.csv', size: 2_500_000, lastModified: '2025-02-01T10:00:00Z' },
      { id: '2-2', name: 'churn_analysis.csv', type: 'file', path: 's3://acme-analytics/reports/churn_analysis.csv', size: 8_900_000, lastModified: '2025-01-28T13:30:00Z' },
    ]
  },
  {
    id: '3', name: 'staging', type: 'folder', path: 's3://acme-analytics/staging',
    children: [
      { id: '3-1', name: 'ingest_batch_0209.csv', type: 'file', path: 's3://acme-analytics/staging/ingest_batch_0209.csv', size: 450_000_000, lastModified: '2025-02-09T06:00:00Z' },
    ]
  },
];

export const sampleMetadata: DatasetMetadata = {
  fileName: 'transactions_2024.csv',
  path: 's3://acme-analytics/data-lake/raw/transactions_2024.csv',
  size: 2_400_000_000,
  rows: 18_742_391,
  columns: 14,
  delimiter: ',',
  encoding: 'UTF-8',
  lastModified: '2024-12-15T08:30:00Z',
  schema: [
    { name: 'transaction_id', type: 'string', nullable: false, sampleValues: ['TXN-0001', 'TXN-0002', 'TXN-0003'] },
    { name: 'timestamp', type: 'date', nullable: false, sampleValues: ['2024-01-15T08:23:11Z', '2024-01-15T08:24:55Z'] },
    { name: 'user_id', type: 'string', nullable: false, sampleValues: ['USR-44821', 'USR-12093'] },
    { name: 'amount', type: 'number', nullable: false, sampleValues: ['129.99', '45.50', '899.00'] },
    { name: 'currency', type: 'string', nullable: false, sampleValues: ['USD', 'EUR', 'GBP'] },
    { name: 'status', type: 'string', nullable: false, sampleValues: ['completed', 'pending', 'failed'] },
    { name: 'merchant_id', type: 'string', nullable: false, sampleValues: ['MCH-001', 'MCH-042'] },
    { name: 'category', type: 'string', nullable: true, sampleValues: ['electronics', 'food', 'travel'] },
    { name: 'country', type: 'string', nullable: false, sampleValues: ['US', 'DE', 'JP', 'BR'] },
    { name: 'payment_method', type: 'string', nullable: true, sampleValues: ['credit_card', 'debit', 'wire'] },
    { name: 'fee', type: 'number', nullable: true, sampleValues: ['2.99', '1.50', '0.00'] },
    { name: 'net_amount', type: 'number', nullable: false, sampleValues: ['127.00', '44.00', '896.01'] },
    { name: 'is_recurring', type: 'boolean', nullable: false, sampleValues: ['true', 'false'] },
    { name: 'notes', type: 'string', nullable: true, sampleValues: ['Monthly sub', '', 'Refund pending'] },
  ],
};

// Generate mock rows
export function generateMockRows(count: number, schema: CsvColumn[]): string[][] {
  const rows: string[][] = [];
  for (let i = 0; i < count; i++) {
    rows.push(schema.map(col => {
      const samples = col.sampleValues;
      return samples[Math.floor(Math.random() * samples.length)] || '';
    }));
  }
  return rows;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}
