import React from 'react';
import { X, History, Trash2, ArrowUpRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { formatBytes } from '../../utils/url';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  const { history, clearHistory, loadHistoryItem, executeRequest } = useApi();

  if (!isOpen) return null;

  const handleSelectAndExecute = async (item: any) => {
    loadHistoryItem(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-200 dark:border-indigo-500/20">
              <History size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Request Execution History</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Past requests executed during this browser session</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-200 dark:border-rose-500/20"
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <History size={36} className="mx-auto opacity-40 text-slate-400" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-400">No requests sent yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Execute requests in the playground to see your request history, timings, and status codes here.
              </p>
            </div>
          ) : (
            history.map(item => {
              const isSuccess = item.status >= 200 && item.status < 300;
              const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });

              return (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2 group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[11px] font-bold rounded font-mono">
                        {item.method}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                        {item.endpointTitle}
                      </span>
                      <span
                        className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${
                          isSuccess
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                            : item.status === 0
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                        }`}
                      >
                        {isSuccess ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                        <span>{item.status === 0 ? 'CORS / Network Err' : `${item.status}`}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelectAndExecute(item)}
                      className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-600/20 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white rounded text-xs font-medium transition-all border border-indigo-200 dark:border-transparent shadow-2xs"
                    >
                      <span>Load in Playground</span>
                      <ArrowUpRight size={12} />
                    </button>
                  </div>

                  <div className="text-xs font-mono text-slate-700 dark:text-slate-400 truncate bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800">
                    {item.url}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-900">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Clock size={11} />
                        <span>{dateStr}</span>
                      </span>
                      <span>Latency: <strong className="text-slate-700 dark:text-slate-400">{item.timeMs}ms</strong></span>
                      {item.sizeBytes !== undefined && (
                        <span>Size: <strong className="text-slate-700 dark:text-slate-400">{formatBytes(item.sizeBytes)}</strong></span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
