import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileSpreadsheet, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { S3Node, s3Tree, formatBytes } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';

interface S3SidebarProps {
  onFileSelect: (node: S3Node) => void;
  selectedFile?: string;
}

const TreeNode = ({ node, depth, onFileSelect, selectedFile }: {
  node: S3Node; depth: number; onFileSelect: (n: S3Node) => void; selectedFile?: string;
}) => {
  const [expanded, setExpanded] = useState(depth === 0);
  const isSelected = selectedFile === node.id;
  const isFolder = node.type === 'folder';

  return (
    <div>
      <button
        onClick={() => isFolder ? setExpanded(!expanded) : onFileSelect(node)}
        className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors group
          ${isSelected ? 'bg-primary/10 text-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent'}
        `}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {isFolder ? (
          expanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
        ) : <span className="w-3.5" />}

        {isFolder ? (
          expanded ? <FolderOpen className="w-4 h-4 shrink-0 text-warning" /> : <Folder className="w-4 h-4 shrink-0 text-warning/70" />
        ) : (
          <FileSpreadsheet className="w-4 h-4 shrink-0 text-primary/70" />
        )}

        <span className="truncate flex-1 text-left">{node.name}</span>

        {node.size && (
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {formatBytes(node.size)}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isFolder && expanded && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {node.children.map(child => (
              <TreeNode key={child.id} node={child} depth={depth + 1} onFileSelect={onFileSelect} selectedFile={selectedFile} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const S3Sidebar = ({ onFileSelect, selectedFile }: S3SidebarProps) => {
  const [search, setSearch] = useState('');

  const filterTree = (nodes: S3Node[], query: string): S3Node[] => {
    if (!query) return nodes;
    return nodes.reduce<S3Node[]>((acc, node) => {
      if (node.name.toLowerCase().includes(query.toLowerCase())) {
        acc.push(node);
      } else if (node.children) {
        const filtered = filterTree(node.children, query);
        if (filtered.length) acc.push({ ...node, children: filtered });
      }
      return acc;
    }, []);
  };

  const filteredTree = filterTree(s3Tree, search);

  return (
    <div className="w-72 border-r border-border bg-sidebar flex flex-col h-full shrink-0">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Folder className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">S3 Explorer</span>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs bg-sidebar-accent border-sidebar-border"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-1">
        {filteredTree.map(node => (
          <TreeNode key={node.id} node={node} depth={0} onFileSelect={onFileSelect} selectedFile={selectedFile} />
        ))}
        {filteredTree.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">No files found</p>
        )}
      </div>

      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Bucket: <span className="text-mono text-foreground/80">acme-analytics</span>
        </p>
      </div>
    </div>
  );
};

export default S3Sidebar;
