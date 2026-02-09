import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, ChevronRight, LogOut, Zap, Table2 } from 'lucide-react';
import S3Sidebar from '@/components/S3Sidebar';
import DataTable from '@/components/DataTable';
import MetadataPanel from '@/components/MetadataPanel';
import SchemaPanel from '@/components/SchemaPanel';
import { S3Node, sampleMetadata } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<S3Node | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (node: S3Node) => {
    setLoading(true);
    setSelectedFile(node);
    // Simulate loading
    setTimeout(() => setLoading(false), 600);
  };

  const breadcrumbs = selectedFile
    ? selectedFile.path.replace('s3://acme-analytics/', '').split('/')
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="h-12 border-b border-border flex items-center px-4 gap-4 shrink-0 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
            <Database className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-bold text-sm gradient-text">CloudCSV</span>
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-xs text-muted-foreground flex-1 min-w-0">
          <span className="hover:text-foreground cursor-pointer transition-colors">acme-analytics</span>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3" />
              <span className={`${i === breadcrumbs.length - 1 ? 'text-foreground font-medium' : 'hover:text-foreground cursor-pointer'} transition-colors truncate`}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>

        <Badge variant="outline" className="text-[10px] border-primary/20 text-primary gap-1">
          <Zap className="w-2.5 h-2.5" /> Athena Ready
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/')}
        >
          <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
        </Button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        <S3Sidebar onFileSelect={handleFileSelect} selectedFile={selectedFile?.id} />

        <main className="flex-1 flex flex-col min-w-0">
          {selectedFile ? (
            loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Streaming data from S3...</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">Detecting schema & reading headers</p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col min-h-0"
              >
                {/* Info panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-4 pb-2">
                  <MetadataPanel metadata={{ ...sampleMetadata, fileName: selectedFile.name, path: selectedFile.path, size: selectedFile.size || sampleMetadata.size }} />
                  <SchemaPanel schema={sampleMetadata.schema} />
                </div>

                {/* Data preview */}
                <div className="flex-1 flex flex-col min-h-0 mx-4 mb-4 glass-panel rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
                    <Table2 className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold">Data Preview</h3>
                    <Badge variant="secondary" className="text-[10px]">Streamed</Badge>
                  </div>
                  <DataTable schema={sampleMetadata.schema} totalRows={sampleMetadata.rows} />
                </div>
              </motion.div>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <h2 className="text-lg font-semibold mb-2">Select a Dataset</h2>
                <p className="text-sm text-muted-foreground">
                  Choose a CSV file from the S3 explorer to preview its schema, metadata, and data.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
