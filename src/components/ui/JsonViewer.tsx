import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Copy, Check, Search, WrapText } from 'lucide-react';

interface JsonViewerProps {
  data: any;
  initialExpandedDepth?: number;
  highlightTerm?: string;
}

interface TreeNodeProps {
  name?: string;
  value: any;
  depth: number;
  isLast: boolean;
  initialExpandedDepth: number;
  highlightTerm?: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  name,
  value,
  depth,
  isLast,
  initialExpandedDepth,
  highlightTerm
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(depth < initialExpandedDepth);

  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);

  const renderValue = (val: any) => {
    if (val === null) {
      return <span className="text-rose-400 font-mono">null</span>;
    }
    if (typeof val === 'boolean') {
      return <span className="text-amber-400 font-mono font-medium">{val ? 'true' : 'false'}</span>;
    }
    if (typeof val === 'number') {
      return <span className="text-amber-300 font-mono">{val}</span>;
    }
    if (typeof val === 'string') {
      const isUrl = /^https?:\/\//.test(val);
      if (isUrl) {
        return (
          <span className="text-emerald-300 font-mono break-all">
            &quot;
            <a
              href={val}
              target="_blank"
              rel="noreferrer noopener"
              className="underline hover:text-emerald-200 transition-colors"
            >
              {val}
            </a>
            &quot;
          </span>
        );
      }
      return <span className="text-emerald-300 font-mono break-all">&quot;{val}&quot;</span>;
    }
    return <span className="text-slate-300 font-mono">{String(val)}</span>;
  };

  const nameElement = name !== undefined ? (
    <span className="text-sky-300 font-mono font-medium">
      &quot;{name}&quot;<span className="text-slate-400 font-normal">: </span>
    </span>
  ) : null;

  if (!isObject) {
    return (
      <div className="font-mono text-xs leading-relaxed hover:bg-slate-800/40 px-1.5 py-0.5 rounded flex items-baseline">
        <span className="inline-block" style={{ width: `${depth * 16}px` }} />
        {nameElement}
        {renderValue(value)}
        {!isLast && <span className="text-slate-500">,</span>}
      </div>
    );
  }

  const keys = Object.keys(value);
  const itemCount = keys.length;
  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';

  if (itemCount === 0) {
    return (
      <div className="font-mono text-xs leading-relaxed px-1.5 py-0.5 flex items-baseline">
        <span className="inline-block" style={{ width: `${depth * 16}px` }} />
        {nameElement}
        <span className="text-slate-400">{openBracket}{closeBracket}</span>
        {!isLast && <span className="text-slate-500">,</span>}
      </div>
    );
  }

  return (
    <div className="font-mono text-xs leading-relaxed">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="hover:bg-slate-800/60 px-1.5 py-0.5 rounded cursor-pointer select-none flex items-center group transition-colors"
      >
        <span className="inline-block" style={{ width: `${depth * 16}px` }} />
        <span className="mr-1 text-slate-500 group-hover:text-slate-300 transition-colors">
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
        {nameElement}
        <span className="text-slate-400">{openBracket}</span>
        {!isExpanded && (
          <span className="text-slate-500 text-[11px] px-1.5 mx-1 bg-slate-800 rounded border border-slate-700/60">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        )}
        {!isExpanded && <span className="text-slate-400">{closeBracket}</span>}
        {!isExpanded && !isLast && <span className="text-slate-500">,</span>}
      </div>

      {isExpanded && (
        <div className="border-l border-slate-800/80 ml-2.5">
          {keys.map((key, idx) => (
            <TreeNode
              key={key}
              name={isArray ? undefined : key}
              value={value[key]}
              depth={depth + 1}
              isLast={idx === keys.length - 1}
              initialExpandedDepth={initialExpandedDepth}
              highlightTerm={highlightTerm}
            />
          ))}
          <div className="px-1.5 py-0.5 flex items-baseline">
            <span className="inline-block" style={{ width: `${depth * 16}px` }} />
            <span className="text-slate-400">{closeBracket}</span>
            {!isLast && <span className="text-slate-500">,</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  initialExpandedDepth = 2,
  highlightTerm = ''
}) => {
  const [viewMode, setViewMode] = useState<'pretty' | 'raw'>('pretty');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandAllKey, setExpandAllKey] = useState<number>(0);
  const [currentExpandDepth, setCurrentExpandDepth] = useState<number>(initialExpandedDepth);

  const rawJsonString = useMemo(() => {
    try {
      return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExpandAll = () => {
    setCurrentExpandDepth(99);
    setExpandAllKey(prev => prev + 1);
  };

  const handleCollapseAll = () => {
    setCurrentExpandDepth(0);
    setExpandAllKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
      {/* Viewer toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => setViewMode('pretty')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'pretty'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tree / Pretty
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'raw'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Text
            </button>
          </div>

          {viewMode === 'pretty' && (
            <div className="hidden sm:flex items-center space-x-1 pl-2 border-l border-slate-800">
              <button
                onClick={handleExpandAll}
                className="px-2 py-1 hover:bg-slate-800 rounded text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                title="Expand All"
              >
                Expand All
              </button>
              <button
                onClick={handleCollapseAll}
                className="px-2 py-1 hover:bg-slate-800 rounded text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                title="Collapse All"
              >
                Collapse All
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700/80 text-xs font-medium transition-all"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Viewer content */}
      <div className="p-3 overflow-auto flex-1 font-mono text-xs max-h-[520px]">
        {viewMode === 'pretty' && typeof data === 'object' && data !== null ? (
          <div key={expandAllKey}>
            <TreeNode
              value={data}
              depth={0}
              isLast={true}
              initialExpandedDepth={currentExpandDepth}
              highlightTerm={highlightTerm || searchTerm}
            />
          </div>
        ) : (
          <pre className="text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all">
            {rawJsonString}
          </pre>
        )}
      </div>
    </div>
  );
};
