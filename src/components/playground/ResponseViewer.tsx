import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  HardDrive,
  Copy,
  Check,
  List,
  Terminal,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { ApiResponseState } from '../../types/api';
import { JsonViewer } from '../ui/JsonViewer';
import { formatBytes } from '../../utils/url';
import { useApi } from '../../context/ApiContext';

interface ResponseViewerProps {
  responseState: ApiResponseState;
  onRetry?: () => void;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ responseState, onRetry }) => {
  const { settings } = useApi();
  const [showHeaders, setShowHeaders] = useState<boolean>(false);
  const [copiedRaw, setCopiedRaw] = useState<boolean>(false);

  const { status, statusText, timeMs, sizeBytes, headers, data, rawText, isJson, error, isLoading, requestUrl } = responseState;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 min-h-[300px] shadow-2xs">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-slate-800 dark:border-t-slate-200 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">Sending API Request...</p>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 max-w-sm truncate">{requestUrl}</p>
        </div>
      </div>
    );
  }

  if (status === null) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-3 min-h-[300px] text-center shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <Terminal size={22} />
        </div>
        <div className="space-y-1 max-w-sm">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-300">Ready to Send Request</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Configure parameters above and click <strong>Send Request</strong> or press <strong>⌘↵ / Ctrl+Enter</strong> to execute live against the API server.
          </p>
        </div>
      </div>
    );
  }

  const isSuccess = status >= 200 && status < 300;
  const isClientError = status === 0;

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(rawText);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Response Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs">
        <div className="flex items-center space-x-3">
          <span
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold border shadow-xs ${
              isSuccess
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                : isClientError
                ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
            ) : isClientError ? (
              <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400" />
            ) : (
              <XCircle size={13} className="text-rose-600 dark:text-rose-400" />
            )}
            <span>
              {status === 0 ? 'Network Error / CORS' : `${status} ${statusText}`}
            </span>
          </span>

          {settings.showTimingBreakdown && timeMs !== null && (
            <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <Clock size={12} className="text-slate-400 dark:text-slate-500" />
              <span>{timeMs} ms</span>
            </div>
          )}

          {settings.showTimingBreakdown && sizeBytes !== null && sizeBytes > 0 && (
            <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <HardDrive size={12} className="text-slate-400 dark:text-slate-500" />
              <span>{formatBytes(sizeBytes)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {Object.keys(headers).length > 0 && (
            <button
              onClick={() => setShowHeaders(!showHeaders)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                showHeaders
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700'
                  : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              <List size={12} />
              <span>Headers ({Object.keys(headers).length})</span>
            </button>
          )}

          <button
            onClick={handleCopyRaw}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium border border-slate-200 dark:border-slate-800 transition-colors shadow-2xs"
            title="Copy Response Body"
          >
            {copiedRaw ? (
              <>
                <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy Body</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optional Headers Drawer */}
      {showHeaders && Object.keys(headers).length > 0 && (
        <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono space-y-1.5 shadow-2xs">
          <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1">
            Response Headers
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-slate-100 dark:divide-slate-800/40">
            {Object.entries(headers).map(([k, v]) => (
              <div key={k} className="flex pt-1 items-baseline">
                <span className="text-slate-900 dark:text-slate-100 font-semibold w-48 shrink-0 break-all">{k}:</span>
                <span className="text-slate-700 dark:text-slate-300 break-all">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Network or CORS Error troubleshooting banner */}
      {isClientError && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 rounded-xl space-y-2 text-xs text-amber-800 dark:text-amber-200">
          <div className="flex items-center space-x-2 font-semibold text-amber-700 dark:text-amber-300">
            <AlertTriangle size={16} />
            <span>Browser Network or CORS Failure</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            The browser could not complete the request. Common causes:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
            <li>Target server is unreachable or offline</li>
            <li>If using a custom localhost URL, verify your server has CORS headers enabled</li>
            <li>Verify your internet connection and verify Base URL is set to <code className="text-amber-700 dark:text-amber-300 font-mono">https://free-api-server.vercel.app</code></li>
          </ul>
        </div>
      )}

      {/* Main Body Viewer */}
      <div className="space-y-1.5">
        <JsonViewer
          data={data !== null ? data : rawText}
          initialExpandedDepth={settings.prettyPrintJson ? 3 : 1}
        />
      </div>
    </div>
  );
};
