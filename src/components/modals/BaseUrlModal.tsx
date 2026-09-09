import React, { useState } from 'react';
import { X, Server, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { DEFAULT_BASE_URL } from '../../utils/url';

interface BaseUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BaseUrlModal: React.FC<BaseUrlModalProps> = ({ isOpen, onClose }) => {
  const { baseUrl, setBaseUrl, serverHealth, checkServerHealth } = useApi();
  const [customInput, setCustomInput] = useState<string>(baseUrl);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = [
    {
      name: 'Production Cloud (Default)',
      url: DEFAULT_BASE_URL,
      badge: 'Recommended',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      name: 'Local Dev Server',
      url: 'http://localhost:3000',
      badge: 'Local Port 3000',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      name: 'Local Dev Port 8000',
      url: 'http://localhost:8000',
      badge: 'Local Port 8000',
      badgeColor: 'bg-slate-700/40 text-slate-300 border-slate-700'
    }
  ];

  const handleSave = () => {
    if (!customInput.trim()) {
      setError('Base URL cannot be empty');
      return;
    }
    setBaseUrl(customInput.trim());
    setError(null);
    onClose();
  };

  const handleSelectPreset = (url: string) => {
    setCustomInput(url);
    setBaseUrl(url);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <Server size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">API Base URL Settings</h3>
              <p className="text-xs text-slate-400">Configure target server for documentation & playground</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status banner */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center space-x-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  serverHealth === 'healthy'
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                    : serverHealth === 'checking'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-rose-400'
                }`}
              />
              <span className="font-medium text-slate-300">
                Current Status:{' '}
                {serverHealth === 'healthy' && <span className="text-emerald-400">Online & Reachable</span>}
                {serverHealth === 'checking' && <span className="text-amber-400">Pinging Server...</span>}
                {serverHealth === 'unhealthy' && <span className="text-rose-400">Unreachable / CORS Offline</span>}
              </span>
            </div>
            <button
              onClick={() => checkServerHealth()}
              className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RefreshCw size={12} className={serverHealth === 'checking' ? 'animate-spin' : ''} />
              <span>Test Connection</span>
            </button>
          </div>

          {/* Presets */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Quick Presets
            </label>
            <div className="space-y-2">
              {presets.map(p => {
                const isSelected = baseUrl === p.url;
                return (
                  <button
                    key={p.url}
                    onClick={() => handleSelectPreset(p.url)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-950/30 border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{p.name}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-400">{p.url}</p>
                    </div>
                    {isSelected && <Check size={16} className="text-indigo-400 ml-2 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Base URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder="https://your-api-domain.com"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-600"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Trailing slashes will be stripped automatically. Requests will be prefixed with this URL.
            </p>
            {error && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-400 mt-2">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};
