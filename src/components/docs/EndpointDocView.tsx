import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Code2,
  Table,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { EndpointDefinition } from '../../types/api';
import { useApi } from '../../context/ApiContext';
import { JsonViewer } from '../ui/JsonViewer';

interface EndpointDocViewProps {
  endpoint: EndpointDefinition;
}

export const EndpointDocView: React.FC<EndpointDocViewProps> = ({ endpoint }) => {
  const { applyPreset, executeRequest, setLayoutMode } = useApi();
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handlePresetClick = (preset: any) => {
    applyPreset(preset);
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      {/* 1. Header & Route */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
          <span>{endpoint.categoryTitle}</span>
          <span>/</span>
          <span className="text-slate-500 dark:text-slate-400">{endpoint.title}</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{endpoint.title}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{endpoint.shortDescription}</p>

        {/* Route Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-mono font-bold rounded">
              {endpoint.method}
            </span>
            <span className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {endpoint.path}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopyUrl(endpoint.exampleRequestUrl)}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-800 transition-colors shadow-2xs"
              title="Copy Example URL"
            >
              {copiedUrl ? (
                <>
                  <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Test Presets */}
      {endpoint.presets.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <Sparkles size={14} className="text-amber-500 dark:text-amber-400" />
            <span>Interactive Preset Scenarios</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {endpoint.presets.map(preset => (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                className="flex flex-col text-left p-3 rounded-lg bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-all group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {preset.label}
                  </span>
                  <Play size={11} className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 opacity-60 group-hover:opacity-100 transition-all" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Description & Notes */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Info size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span>Endpoint Overview</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {endpoint.description}
        </p>

        {endpoint.notes && endpoint.notes.length > 0 && (
          <div className="p-3.5 bg-slate-100/80 dark:bg-slate-950/90 border-l-2 border-indigo-500 rounded-r-lg space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="font-semibold text-indigo-600 dark:text-indigo-300 text-[11px] uppercase tracking-wider">
              Implementation Notes
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 leading-relaxed">
              {endpoint.notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 4. Path Parameters */}
      {endpoint.pathParams.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Table size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>Path Parameters</span>
          </h2>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Parameter</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Requirement</th>
                    <th className="py-2.5 px-3">Description & Allowed Values</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                  {endpoint.pathParams.map(param => (
                    <tr key={param.name} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-semibold text-indigo-600 dark:text-indigo-300">:{param.name}</td>
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[11px]">
                          {param.type}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {param.required ? (
                          <span className="px-1.5 py-0.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded text-[10px] font-bold">
                            REQUIRED
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px]">
                            OPTIONAL
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-700 dark:text-slate-300 space-y-1.5">
                        <p>{param.description}</p>
                        {param.options && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {param.options.map(opt => (
                              <span
                                key={opt.value}
                                className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded font-mono text-[10px]"
                                title={opt.description}
                              >
                                {opt.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Query Parameters */}
      {endpoint.queryParams.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Table size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>Query Parameters</span>
          </h2>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Parameter</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Requirement</th>
                    <th className="py-2.5 px-3">Description & Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                  {endpoint.queryParams.map(param => (
                    <tr key={param.name} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-semibold text-sky-600 dark:text-sky-300">{param.name}</td>
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[11px]">
                          {param.type}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {param.required ? (
                          <span className="px-1.5 py-0.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded text-[10px] font-bold">
                            REQUIRED
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px]">
                            OPTIONAL
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-700 dark:text-slate-300 space-y-1.5">
                        <p>{param.description}</p>
                        {param.defaultValue && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            Default: <span className="text-amber-600 dark:text-amber-300">{String(param.defaultValue)}</span>
                          </p>
                        )}
                        {param.options && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {param.options.map(opt => (
                              <span
                                key={opt.value}
                                className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded font-mono text-[10px]"
                                title={opt.description}
                              >
                                {opt.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Response Schema / Example */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Code2 size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span>Expected Response (200 OK)</span>
        </h2>
        <JsonViewer data={endpoint.responseExample} initialExpandedDepth={2} />
      </div>

      {/* 7. HTTP Status Codes */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span>Supported Status Codes</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {endpoint.statusCodes.map(sc => {
            const isSuccess = sc.code >= 200 && sc.code < 300;
            return (
              <div
                key={sc.code}
                className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-xs shadow-2xs"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] border ${
                      isSuccess
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                        : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                    }`}
                  >
                    {sc.code}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{sc.title}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{sc.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
