import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  Terminal,
  Code2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { EndpointDefinition, EndpointPreset } from '../../types/api';
import { useApi } from '../../context/ApiContext';
import { buildUrl } from '../../utils/url';
import { ResponseViewer } from './ResponseViewer';
import { CodeSnippetView } from './CodeSnippetView';

interface PlaygroundPanelProps {
  endpoint: EndpointDefinition;
}

export const PlaygroundPanel: React.FC<PlaygroundPanelProps> = ({ endpoint }) => {
  const {
    baseUrl,
    pathParams,
    updatePathParam,
    queryParams,
    updateQueryParam,
    customQueryParams,
    addCustomQueryParam,
    updateCustomQueryParam,
    removeCustomQueryParam,
    responseState,
    executeRequest,
    resetParams,
    applyPreset
  } = useApi();

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'response' | 'snippets'>('response');

  // Build live URL
  const { fullUrl } = buildUrl(
    baseUrl,
    endpoint,
    pathParams,
    queryParams,
    customQueryParams
  );

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter to execute request
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        executeRequest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeRequest]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCurl = () => {
    const curl = `curl -X GET "${fullUrl}"`;
    navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-5 p-4 sm:p-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      {/* 1. Request Builder Header Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <Sliders size={16} />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">Interactive Playground</h2>
          </div>

          {/* Quick Presets Pills */}
          {endpoint.presets.length > 0 && (
            <div className="hidden sm:flex items-center space-x-1.5 overflow-x-auto py-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                <Sparkles size={11} className="text-amber-400" />
                <span>Presets:</span>
              </span>
              {endpoint.presets.slice(0, 3).map(preset => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className="px-2 py-0.5 text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md border border-slate-700/60 transition-colors whitespace-nowrap"
                  title={preset.description}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live URL Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner p-1.5 gap-2">
          <div className="flex items-center px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-mono font-bold text-xs shrink-0 self-start sm:self-auto">
            {endpoint.method}
          </div>

          <div className="font-mono text-xs text-slate-200 truncate flex-1 px-2 py-1 select-all break-all sm:break-normal">
            {fullUrl}
          </div>

          <div className="flex items-center space-x-1 shrink-0 self-end sm:self-auto">
            <button
              onClick={handleCopyUrl}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 transition-colors"
              title="Copy live URL"
            >
              {copiedUrl ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>

            <a
              href={fullUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors"
              title="Open raw request in new tab"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Parameters Configuration Box */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-5 shadow-sm">
        {/* Path Parameters Section */}
        {endpoint.pathParams.length > 0 && (
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <span>Path Parameters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {endpoint.pathParams.map(param => {
                const currentValue = pathParams[param.name] ?? (param.defaultValue || '');
                return (
                  <div key={param.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-mono text-indigo-300 font-semibold flex items-center space-x-1">
                        <span>:{param.name}</span>
                        {param.required && <span className="text-rose-400 text-[10px]">*</span>}
                      </label>
                      <span className="text-[10px] text-slate-500">{param.type}</span>
                    </div>

                    {param.options && param.options.length > 0 ? (
                      <select
                        value={currentValue}
                        onChange={e => updatePathParam(param.name, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      >
                        {param.options.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label} ({opt.value})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={param.type === 'number' ? 'number' : 'text'}
                        value={currentValue}
                        onChange={e => updatePathParam(param.name, e.target.value)}
                        placeholder={param.placeholder || `Enter ${param.name}`}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    )}
                    <p className="text-[10px] text-slate-400">{param.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Query Parameters Section */}
        {endpoint.queryParams.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Query Parameters</span>
              <span className="text-[10px] font-mono text-slate-500 lowercase">auto-encoded in URL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {endpoint.queryParams.map(param => {
                const currentValue = queryParams[param.name] ?? '';
                const isCountriesEndpoint = endpoint.id === 'countries';
                const isAllSelectedInCountries = isCountriesEndpoint && queryParams.type === 'all';
                const isValueFieldInCountries = isCountriesEndpoint && param.name === 'value';

                return (
                  <div key={param.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-mono text-sky-300 font-semibold flex items-center space-x-1">
                        <span>{param.name}</span>
                        {param.required && !isAllSelectedInCountries && (
                          <span className="text-rose-400 text-[10px]">*</span>
                        )}
                      </label>
                      <span className="text-[10px] text-slate-500">
                        {param.required && !isAllSelectedInCountries ? 'required' : 'optional'}
                      </span>
                    </div>

                    {param.options && param.options.length > 0 ? (
                      <select
                        value={currentValue}
                        onChange={e => updateQueryParam(param.name, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      >
                        {!param.required && <option value="">(None / Default)</option>}
                        {param.options.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={param.type === 'number' ? 'number' : 'text'}
                        value={currentValue}
                        disabled={isValueFieldInCountries && isAllSelectedInCountries}
                        onChange={e => updateQueryParam(param.name, e.target.value)}
                        placeholder={
                          isValueFieldInCountries && isAllSelectedInCountries
                            ? 'Not required for type=all'
                            : param.placeholder || `Enter ${param.name}`
                        }
                        className={`w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono ${
                          isValueFieldInCountries && isAllSelectedInCountries ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                      />
                    )}
                    <p className="text-[10px] text-slate-400">
                      {isValueFieldInCountries && isAllSelectedInCountries
                        ? 'Omitted because type is set to all'
                        : param.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Query Parameters */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Custom Query Parameters
            </span>
            <button
              onClick={addCustomQueryParam}
              className="flex items-center space-x-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 text-indigo-400 text-xs font-medium rounded border border-slate-800 transition-colors"
            >
              <Plus size={12} />
              <span>Add Parameter</span>
            </button>
          </div>

          {customQueryParams.length > 0 && (
            <div className="space-y-2">
              {customQueryParams.map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={e => updateCustomQueryParam(item.id, { enabled: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={item.key}
                    onChange={e => updateCustomQueryParam(item.id, { key: e.target.value })}
                    placeholder="Key (e.g. filter)"
                    className="w-1/3 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 font-mono"
                  />
                  <input
                    type="text"
                    value={item.value}
                    onChange={e => updateCustomQueryParam(item.id, { value: e.target.value })}
                    placeholder="Value (e.g. active)"
                    className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 font-mono"
                  />
                  <button
                    onClick={() => removeCustomQueryParam(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={resetParams}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset Parameters</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCurl}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 transition-colors"
            >
              {copiedCurl ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">cURL Copied</span>
                </>
              ) : (
                <>
                  <Terminal size={13} />
                  <span>Copy cURL</span>
                </>
              )}
            </button>

            <button
              onClick={() => executeRequest()}
              disabled={responseState.isLoading}
              className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              <Play size={14} className={responseState.isLoading ? 'animate-spin' : 'fill-white'} />
              <span>{responseState.isLoading ? 'Executing...' : 'Send Request'}</span>
              <kbd className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 bg-black/20 text-emerald-100 rounded text-[10px] font-mono">
                ⌘↵
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Output Tabs: Response Viewer vs. Code Snippets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveBottomTab('response')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeBottomTab === 'response'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal size={14} />
              <span>Response Output</span>
              {responseState.status !== null && (
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    responseState.status >= 200 && responseState.status < 300
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {responseState.status === 0 ? 'ERR' : responseState.status}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveBottomTab('snippets')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeBottomTab === 'snippets'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 size={14} />
              <span>Client Code Snippets</span>
            </button>
          </div>
        </div>

        {activeBottomTab === 'response' ? (
          <ResponseViewer responseState={responseState} onRetry={executeRequest} />
        ) : (
          <CodeSnippetView fullUrl={fullUrl} />
        )}
      </div>
    </div>
  );
};
