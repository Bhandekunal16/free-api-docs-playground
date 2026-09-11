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
  Dog,
  Film,
  Coins,
  Network,
  User,
  Users,
  Flag,
  Github,
  Library,
  BookMarked,
  Lock,
  ShieldAlert,
  AlertTriangle,
  UtensilsCrossed,
  Utensils,
  Wine,
  Smile,
  Laugh,
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
    catFacts: false,
    dogs: false,
    jikan: false,
    coingecko: false,
    ipify: false,
    agify: false,
    genderize: false,
    nationalize: false,
    github: false,
    openLibrary: false,
    gutendex: false,
    mealDb: false,
    cocktailDb: false,
    jokeApi: false,
    officialJoke: false,
    randomUser: false,
    bored: false,
    openFoodFacts: false
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
  const dogsEndpoints = API_ENDPOINTS.filter(e => e.category === 'dogs');
  const jikanEndpoints = API_ENDPOINTS.filter(e => e.category === 'jikan');
  const coingeckoEndpoints = API_ENDPOINTS.filter(e => e.category === 'coingecko');
  const ipifyEndpoints = API_ENDPOINTS.filter(e => e.category === 'ipify');
  const agifyEndpoints = API_ENDPOINTS.filter(e => e.category === 'agify');
  const genderizeEndpoints = API_ENDPOINTS.filter(e => e.category === 'genderize');
  const nationalizeEndpoints = API_ENDPOINTS.filter(e => e.category === 'nationalize');
  const githubEndpoints = API_ENDPOINTS.filter(e => e.category === 'github');
  const openLibraryEndpoints = API_ENDPOINTS.filter(e => e.category === 'open-library');
  const gutendexEndpoints = API_ENDPOINTS.filter(e => e.category === 'gutendex');
  const mealDbEndpoints = API_ENDPOINTS.filter(e => e.category === 'meal-db');
  const cocktailDbEndpoints = API_ENDPOINTS.filter(e => e.category === 'cocktail-db');
  const jokeApiEndpoints = API_ENDPOINTS.filter(e => e.category === 'joke-api');
  const officialJokeEndpoints = API_ENDPOINTS.filter(e => e.category === 'official-joke');
  const randomUserEndpoints = API_ENDPOINTS.filter(e => e.category === 'random-user');
  const boredEndpoints = API_ENDPOINTS.filter(e => e.category === 'bored');
  const openFoodFactsEndpoints = API_ENDPOINTS.filter(e => e.category === 'open-food-facts');

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

                <button
                  onClick={() => handleSelect('doc', 'open-food-facts')}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    activeSelection.type === 'doc' && activeSelection.id === 'open-food-facts'
                      ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <UtensilsCrossed size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate">Open Food Facts Guide</span>
                </button>

                <button
                  onClick={() => handleSelect('doc', 'randomUser')}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    activeSelection.type === 'doc' && activeSelection.id === 'randomUser'
                      ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Users size={14} className="shrink-0 text-teal-600 dark:text-teal-400" />
                  <span className="truncate">Random User API Reference</span>
                </button>

                <button
                  onClick={() => handleSelect('doc', 'bored')}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    activeSelection.type === 'doc' && activeSelection.id === 'bored'
                      ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Sparkles size={14} className="shrink-0 text-amber-500 dark:text-amber-400" />
                  <span className="truncate">Bored API Reference</span>
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
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.health ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
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
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">5 routes</span>
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

          {/* 9. SECTION: DOGS */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('dogs')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Dog size={12} className="text-amber-500" />
                <span>Dogs</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.dogs ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.dogs && (
              <div className="space-y-0.5 pt-0.5">
                {dogsEndpoints.map(ep => {
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

          {/* 10. SECTION: JIKAN */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('jikan')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Film size={12} className="text-indigo-500" />
                <span>Jikan</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.jikan ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.jikan && (
              <div className="space-y-0.5 pt-0.5">
                {jikanEndpoints.map(ep => {
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

          {/* 11. SECTION: COINGECKO */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('coingecko')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Coins size={12} className="text-emerald-500" />
                <span>CoinGecko</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.coingecko ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.coingecko && (
              <div className="space-y-0.5 pt-0.5">
                {coingeckoEndpoints.map(ep => {
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

          {/* 12. SECTION: IPIFY */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('ipify')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Network size={12} className="text-emerald-500" />
                <span>IPify</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.ipify ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.ipify && (
              <div className="space-y-0.5 pt-0.5">
                {ipifyEndpoints.map(ep => {
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

          {/* 13. SECTION: AGIFY */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('agify')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <User size={12} className="text-emerald-500" />
                <span>Agify</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.agify ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.agify && (
              <div className="space-y-0.5 pt-0.5">
                {agifyEndpoints.map(ep => {
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

          {/* 14. SECTION: GENDERIZE */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('genderize')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Users size={12} className="text-emerald-500" />
                <span>Genderize</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.genderize ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.genderize && (
              <div className="space-y-0.5 pt-0.5">
                {genderizeEndpoints.map(ep => {
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

          {/* 15. SECTION: NATIONALIZE */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('nationalize')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Flag size={12} className="text-emerald-500" />
                <span>Nationalize</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.nationalize ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.nationalize && (
              <div className="space-y-0.5 pt-0.5">
                {nationalizeEndpoints.map(ep => {
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

          {/* 16. SECTION: GITHUB */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('github')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Github size={12} className="text-emerald-500" />
                <span>GitHub</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.github ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.github && (
              <div className="space-y-0.5 pt-0.5">
                {githubEndpoints.map(ep => {
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

          {/* 17. SECTION: OPEN LIBRARY */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('openLibrary')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Library size={12} className="text-emerald-500" />
                <span>Open Library</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">1 route</span>
                {collapsedSections.openLibrary ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.openLibrary && (
              <div className="space-y-0.5 pt-0.5">
                {openLibraryEndpoints.map(ep => {
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

          {/* 18. SECTION: GUTENDEX */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('gutendex')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <BookMarked size={12} className="text-amber-500" />
                <span>Gutendex</span>
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="flex items-center space-x-1 px-1.5 py-0.5 text-[9px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded">
                  <Lock size={9} />
                  <span>WORKING ON</span>
                </span>
                {collapsedSections.gutendex ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.gutendex && (
              <div className="space-y-0.5 pt-0.5">
                {gutendexEndpoints.map(ep => {
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
                      <span className="flex items-center space-x-1 px-1.5 py-0.5 text-[9px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded shrink-0 ml-1">
                        <Lock size={8} />
                        <span>Dev Only</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 20. SECTION: THEMEALDB */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('mealDb')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Utensils size={12} className="text-amber-500" />
                <span>TheMealDB</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {mealDbEndpoints.length} {mealDbEndpoints.length === 1 ? 'route' : 'routes'}
                </span>
                {collapsedSections.mealDb ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.mealDb && (
              <div className="space-y-0.5 pt-0.5">
                {mealDbEndpoints.map(ep => {
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

          {/* 21. SECTION: THECOCKTAILDB */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('cocktailDb')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Wine size={12} className="text-pink-500" />
                <span>TheCocktailDB</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {cocktailDbEndpoints.length} {cocktailDbEndpoints.length === 1 ? 'route' : 'routes'}
                </span>
                {collapsedSections.cocktailDb ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.cocktailDb && (
              <div className="space-y-0.5 pt-0.5">
                {cocktailDbEndpoints.map(ep => {
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

          {/* 22. SECTION: JOKEAPI */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('jokeApi')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Smile size={12} className="text-amber-500" />
                <span>JokeAPI</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {jokeApiEndpoints.length} {jokeApiEndpoints.length === 1 ? 'route' : 'routes'}
                </span>
                {collapsedSections.jokeApi ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.jokeApi && (
              <div className="space-y-0.5 pt-0.5">
                {jokeApiEndpoints.map(ep => {
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

          {/* 23. SECTION: OFFICIAL JOKE API */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('officialJoke')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Laugh size={12} className="text-yellow-500" />
                <span>Official Joke API</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {officialJokeEndpoints.length} {officialJokeEndpoints.length === 1 ? 'route' : 'routes'}
                </span>
                {collapsedSections.officialJoke ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.officialJoke && (
              <div className="space-y-0.5 pt-0.5">
                {officialJokeEndpoints.map(ep => {
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

          {/* 24. SECTION: RANDOM USER API */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('randomUser')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Users size={12} className="text-teal-500" />
                <span>Random User API</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {randomUserEndpoints.length} {randomUserEndpoints.length === 1 ? 'route' : 'routes'}
                </span>
                {collapsedSections.randomUser ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.randomUser && (
              <div className="space-y-0.5 pt-0.5">
                {randomUserEndpoints.map(ep => {
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

          {/* 25. SECTION: BORED API */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('bored')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <Sparkles size={12} className="text-amber-500" />
                <span>Bored API</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {boredEndpoints.length} {boredEndpoints.length === 1 ? 'route' : 'routes'}
                </span>
                {collapsedSections.bored ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.bored && (
              <div className="space-y-0.5 pt-0.5">
                {boredEndpoints.map(ep => {
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

          {/* 26. SECTION: OPEN FOOD FACTS */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('openFoodFacts')}
              className="w-full px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                <UtensilsCrossed size={12} className="text-emerald-500" />
                <span>Open Food Facts</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {openFoodFactsEndpoints.length} {openFoodFactsEndpoints.length === 1 ? 'route' : 'routes'}
                </span>
                {collapsedSections.openFoodFacts ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>

            {!collapsedSections.openFoodFacts && (
              <div className="space-y-0.5 pt-0.5">
                {openFoodFactsEndpoints.map(ep => {
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
