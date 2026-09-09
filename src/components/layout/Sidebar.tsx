import React, { useState } from 'react';
import {
  BookOpen,
  Activity,
  Layers,
  Globe,
  CloudSun,
  Sparkles,
  Tv,
  Quote,
  ShieldAlert,
  AlertTriangle,
  ChevronDown,
  ChevronRight
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
  
  // Collapsible section states
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    docs: false,
    health: false,
    fake: false,
    geography: false,
    weather: false,
    pokemon: false,
    rickAndMorty: false,
    catFacts: false
  });

  const toggleSection = (key: string) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (type: 'endpoint' | 'doc', id: string) => {
    setActiveSelection({ type, id });
    setIsMobileMenuOpen(false);
  };

  // Group endpoints
  const healthEndpoints = API_ENDPOINTS.filter(e => e.category === 'health');
  const fakeEndpoints = API_ENDPOINTS.filter(e => e.category === 'fake' || e.category === 'mock');
  const geographyEndpoints = API_ENDPOINTS.filter(e => e.category === 'geography');
  const weatherEndpoints = API_ENDPOINTS.filter(e => e.category === 'weather');
  const pokemonEndpoints = API_ENDPOINTS.filter(e => e.category === 'pokemon');
  const rickAndMortyEndpoints = API_ENDPOINTS.filter(e => e.category === 'rick-and-morty');
  const catFactsEndpoints = API_ENDPOINTS.filter(e => e.category === 'cat-facts');

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
        className={`fixed top-14 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Menubar Header with Version & Mode Badge */}
        <div className="px-3.5 py-3 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">Explorer</span>
          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
            v1.0 Docs & Playground
          </span>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 text-xs">
          {/* 1. SECTION: DOCS */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('docs')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <BookOpen size={12} className="text-slate-500" />
                <span>Docs</span>
              </span>
              {collapsedSections.docs ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
            </button>

            {!collapsedSections.docs && (
              <div className="space-y-0.5 pt-0.5">
                <button
                  onClick={() => handleSelect('doc', 'overview')}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    activeSelection.type === 'doc' && activeSelection.id === 'overview'
                      ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <BookOpen size={14} className="shrink-0 text-slate-700 dark:text-slate-300" />
                  <span className="truncate">Overview</span>
                </button>

                <button
                  onClick={() => handleSelect('doc', 'http-status-codes')}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    activeSelection.type === 'doc' && activeSelection.id === 'http-status-codes'
                      ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldAlert size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
                  <span className="truncate">HTTP Status Codes</span>
                </button>

                <button
                  onClick={() => handleSelect('doc', 'error-handling')}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    activeSelection.type === 'doc' && activeSelection.id === 'error-handling'
                      ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <AlertTriangle size={14} className="shrink-0 text-rose-600 dark:text-rose-400" />
                  <span className="truncate">Error Handling</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. SECTION: HEALTH CHECK */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('health')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Activity size={12} className="text-emerald-500" />
                <span>Health Check</span>
              </span>
              {collapsedSections.health ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
            </button>

            {!collapsedSections.health && (
              <div className="space-y-0.5 pt-0.5">
                {healthEndpoints.map(ep => {
                  const isActive = activeSelection.type === 'endpoint' && activeSelection.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => handleSelect('endpoint', ep.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded shrink-0">
                          {ep.method}
                        </span>
                        <span className="truncate font-mono text-[11px]">{ep.path}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. SECTION: FAKE API */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('fake')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Layers size={12} className="text-slate-500" />
                <span>Fake API</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">5 routes</span>
                {collapsedSections.fake ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.fake && (
              <div className="space-y-0.5 pt-0.5">
                {fakeEndpoints.map(ep => {
                  const isActive = activeSelection.type === 'endpoint' && activeSelection.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => handleSelect('endpoint', ep.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded shrink-0">
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
            )}
          </div>

          {/* 4. SECTION: GEOGRAPHY */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('geography')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Globe size={12} className="text-slate-500" />
                <span>Geography</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.geography ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.geography && (
              <div className="space-y-0.5 pt-0.5">
                {geographyEndpoints.map(ep => {
                  const isActive = activeSelection.type === 'endpoint' && activeSelection.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => handleSelect('endpoint', ep.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded shrink-0">
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
            )}
          </div>

          {/* 5. SECTION: WEATHER */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('weather')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <CloudSun size={12} className="text-slate-500" />
                <span>Weather</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.weather ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.weather && (
              <div className="space-y-0.5 pt-0.5">
                {weatherEndpoints.map(ep => {
                  const isActive = activeSelection.type === 'endpoint' && activeSelection.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => handleSelect('endpoint', ep.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded shrink-0">
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
            )}
          </div>

          {/* 6. SECTION: POKÉMON */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('pokemon')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Sparkles size={12} className="text-amber-500" />
                <span>Pokémon</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.pokemon ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.pokemon && (
              <div className="space-y-0.5 pt-0.5">
                {pokemonEndpoints.map(ep => {
                  const isActive = activeSelection.type === 'endpoint' && activeSelection.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => handleSelect('endpoint', ep.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded shrink-0">
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
            )}
          </div>

          {/* 7. SECTION: RICK AND MORTY */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('rickAndMorty')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Tv size={12} className="text-cyan-500" />
                <span>Rick and Morty</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.rickAndMorty ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.rickAndMorty && (
              <div className="space-y-0.5 pt-0.5">
                {rickAndMortyEndpoints.map(ep => {
                  const isActive = activeSelection.type === 'endpoint' && activeSelection.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => handleSelect('endpoint', ep.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded shrink-0">
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
            )}
          </div>

          {/* 8. SECTION: CAT FACTS */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('catFacts')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Quote size={12} className="text-violet-500" />
                <span>Cat Facts</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.catFacts ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.catFacts && (
              <div className="space-y-0.5 pt-0.5">
                {catFactsEndpoints.map(ep => {
                  const isActive = activeSelection.type === 'endpoint' && activeSelection.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => handleSelect('endpoint', ep.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded shrink-0">
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
            )}
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Read-only GET APIs</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400/90 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span>Open Access</span>
          </span>
        </div>
      </aside>
    </>
  );
};
