import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import {
  generateCurl,
  generateFetchSnippet,
  generateAxiosSnippet,
  generatePythonSnippet
} from '../../utils/url';

interface CodeSnippetViewProps {
  fullUrl: string;
}

export const CodeSnippetView: React.FC<CodeSnippetViewProps> = ({ fullUrl }) => {
  const { activeSnippetTab, setActiveSnippetTab } = useApi();
  const [copied, setCopied] = useState<boolean>(false);

  const getSnippetContent = () => {
    switch (activeSnippetTab) {
      case 'fetch':
        return { language: 'javascript', code: generateFetchSnippet(fullUrl) };
      case 'axios':
        return { language: 'javascript', code: generateAxiosSnippet(fullUrl) };
      case 'python':
        return { language: 'python', code: generatePythonSnippet(fullUrl) };
      case 'curl':
      default:
        return { language: 'bash', code: generateCurl(fullUrl) };
    }
  };

  const { language, code } = getSnippetContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: 'curl' | 'fetch' | 'axios' | 'python'; label: string }[] = [
    { id: 'curl', label: 'cURL' },
    { id: 'fetch', label: 'JS (Fetch)' },
    { id: 'axios', label: 'JS (Axios)' },
    { id: 'python', label: 'Python (Requests)' }
  ];

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-2xs">
      {/* Tabs bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSnippetTab(tab.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeSnippetTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition-all shadow-2xs"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code box */}
      <div className="p-3 font-mono text-xs overflow-x-auto max-h-48 text-slate-800 dark:text-slate-200 leading-relaxed">
        <pre className="whitespace-pre-wrap break-all">{code}</pre>
      </div>
    </div>
  );
};
