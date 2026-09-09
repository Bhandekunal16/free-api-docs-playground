import React, { useState } from 'react';
import {
  BookOpen,
  Activity,
  Layers,
  Database,
  Globe,
  CloudSun,
  ShieldAlert,
  AlertTriangle,
  Search,
  ChevronRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { API_ENDPOINTS } from '../../data/apiEndpoints';
import { DOC_ARTICLES } from '../../data/docSections';

export const Sidebar: React.FC = () => {
  const {
    activeSelection,
    setActiveSelection,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApi();

  const [filterQuery, setFilterQuery] = useState<string>('');

  const handleSelect = (type: 'endpoint' | 'doc', id: string) => {
    setActiveSelection({ type, id });
    setIsMobileMenuOpen(false);
  };

  // Group endpoints
  const healthEndpoints = API_ENDPOINTS.filter(e => e.category === 'health');
  const fakeEndpoints = API_ENDPOINTS.filter(e => e.category === 'fake');
  const mockEndpoints = API_ENDPOINTS.filter(e => e.category === 'mock');
  const countriesEndpoints = API_ENDPOINTS.filter(e => e.category === 'countries');
  const weatherEndpoints = API_ENDPOINTS.filter(e => e.category === 'weather');

  const filterItem = (title: string, path?: string) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return title.toLowerCase().includes(q) || (path && path.toLowerCase().includes(q));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Search filter in sidebar */}
        <div className="p-3 border-b border-slate-800/80">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Filter endpoints..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
          {/* SECTION: GETTING STARTED & GUIDES */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Documentation</span>
            </div>
            <div className="space-y-0.5">
              {filterItem(DOC_ARTICLES.overview.title) && (
                <button
                  onClick={() => handleSelect('doc', 'overview')}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    activeSelection.type === 'doc' && activeSelection.id === 'overview'
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <BookOpen size={14} className="shrink-0 text-indigo-400" />
                  <span className="truncate">Overview</span>
                </button>
              )}

              {filterItem(DOC_ARTICLES['http-status-codes'].title) && (
                <button
                  onClick={() => handleSelect('doc', 'http-status-codes')}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    activeSelection.type === 'doc' && activeSelection.id === 'http-status-codes'
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldAlert size={14} className="shrink-0 text-amber-400" />
                  <span className="truncate">HTTP Status Codes</span>
                </button>
              )}

              {filterItem(DOC_ARTICLES['error-handling'].title) && (
                <button
                  onClick={() => handleSelect('doc', 'error-handling')}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    activeSelection.type === 'doc' && activeSelection.id === 'error-handling'
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <AlertTriangle size={14} className="shrink-0 text-rose-400" />
                  <span className="truncate">Error Handling</span>
                </button>
              )}
            </div>
          </div>

          {/* SECTION: HEALTH CHECK */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Health Check</span>
            </div>
            <div className="space-y-0.5">
              {healthEndpoints.filter(e => filterItem(e.title, e.path)).map(ep => {
                const isActive = activeSelection.type === 'endpoint' && activeSelection.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelect('endpoint', ep.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded shrink-0">
                        {ep.method}
                      </span>
                      <span className="truncate font-mono text-[11px]">{ep.path}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION: FAKE API */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Fake API</span>
              <span className="text-[10px] font-mono text-slate-600">3 routes</span>
            </div>
            <div className="space-y-0.5">
              {fakeEndpoints.filter(e => filterItem(e.title, e.path)).map(ep => {
                const isActive = activeSelection.type === 'endpoint' && activeSelection.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelect('endpoint', ep.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded shrink-0">
                        {ep.method}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-mono text-[11px]">{ep.path}</div>
                        <div className="text-[10px] text-slate-500 truncate">{ep.title}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION: MOCK API */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Mock API</span>
              <span className="text-[10px] font-mono text-slate-600">2 routes</span>
            </div>
            <div className="space-y-0.5">
              {mockEndpoints.filter(e => filterItem(e.title, e.path)).map(ep => {
                const isActive = activeSelection.type === 'endpoint' && activeSelection.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelect('endpoint', ep.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded shrink-0">
                        {ep.method}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-mono text-[11px]">{ep.path}</div>
                        <div className="text-[10px] text-slate-500 truncate">{ep.title}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION: COUNTRIES API */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Countries API</span>
            </div>
            <div className="space-y-0.5">
              {countriesEndpoints.filter(e => filterItem(e.title, e.path)).map(ep => {
                const isActive = activeSelection.type === 'endpoint' && activeSelection.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelect('endpoint', ep.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded shrink-0">
                        {ep.method}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-mono text-[11px]">{ep.path}</div>
                        <div className="text-[10px] text-slate-500 truncate">{ep.title}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION: WEATHER API */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Weather API</span>
            </div>
            <div className="space-y-0.5">
              {weatherEndpoints.filter(e => filterItem(e.title, e.path)).map(ep => {
                const isActive = activeSelection.type === 'endpoint' && activeSelection.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelect('endpoint', ep.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded shrink-0">
                        {ep.method}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-mono text-[11px]">{ep.path}</div>
                        <div className="text-[10px] text-slate-500 truncate">{ep.title}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Read-only GET APIs</span>
          <span className="font-mono text-emerald-400/90 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Open Access</span>
          </span>
        </div>
      </aside>
    </>
  );
};
