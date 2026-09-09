import React, { useState, useEffect, useRef } from 'react';
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
import { EndpointDefinition, EndpointPreset, ParamDefinition } from '../../types/api';
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
    applyPreset,
    settings
  } = useApi();

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [showAllPresets, setShowAllPresets] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'response' | 'snippets'>('response');
  const [validationError, setValidationError] = useState<string | null>(null);
  const responseSectionRef = useRef<HTMLDivElement>(null);
  const prevLoadingRef = useRef<boolean>(false);

  // Clear validation error on param change
  useEffect(() => {
    setValidationError(null);
  }, [queryParams, pathParams, endpoint.id]);

  // Build live URL
  const { fullUrl } = buildUrl(
    baseUrl,
    endpoint,
    pathParams,
    queryParams,
    customQueryParams
  );

  // Auto-scroll to response if enabled
  useEffect(() => {
    if (prevLoadingRef.current && !responseState.isLoading && responseState.status !== null) {
      if (settings.autoScrollToResponse && responseSectionRef.current) {
        responseSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    prevLoadingRef.current = responseState.isLoading;
  }, [responseState.isLoading, responseState.status, settings.autoScrollToResponse]);

  // Send request with validation
  const handleSendRequest = () => {
    // Validate CoinGecko endpoint
    if (endpoint.id === 'coingecko') {
      const op = queryParams.type || 'ping';
      const COINGECKO_ID_OPERATIONS = ['coin', 'exchange', 'exchangeTickers', 'nft'];
      if (COINGECKO_ID_OPERATIONS.includes(op) && (!queryParams.value || !queryParams.value.trim())) {
        setValidationError(`The "${op}" operation requires a coin, exchange, or NFT ID in the "Value / ID" field (e.g. "bitcoin").`);
        return;
      }
    }

    // Validate Agify, Genderize & Nationalize endpoints
    if (endpoint.id === 'agify' || endpoint.id === 'genderize' || endpoint.id === 'nationalize') {
      if (!queryParams.name || !queryParams.name.trim()) {
        setValidationError('Name is required.');
        return;
      }
    }

    setValidationError(null);
    executeRequest();
  };

  // Handle Preset Selection
  const handlePresetClick = (preset: EndpointPreset) => {
    setValidationError(null);
    applyPreset(preset);
    if (settings.autoSendPreset) {
      setTimeout(() => {
        executeRequest();
      }, 50);
    }
  };

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter to execute request
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSendRequest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSendRequest]);

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

  const hasPathParams = endpoint.pathParams.length > 0;
  const hasQueryParams = endpoint.queryParams.length > 0;
  const hasAnyParams = hasPathParams || hasQueryParams || customQueryParams.length > 0;

  // Preset limiting: max 5 visible, rest under more
  const visiblePresets = showAllPresets ? endpoint.presets : endpoint.presets.slice(0, 5);
  const remainingPresetCount = Math.max(0, endpoint.presets.length - 5);

  const renderQueryParamInput = (param: ParamDefinition) => {
    const currentValue = queryParams[param.name] ?? '';
    const isCountriesEndpoint = endpoint.id === 'countries';
    const isAllSelectedInCountries = isCountriesEndpoint && queryParams.type === 'all';
    const isValueFieldInCountries = isCountriesEndpoint && param.name === 'value';

    // Context-awareness for Dogs API
    const isDogsEndpoint = endpoint.id === 'dogs';
    const selectedDogType = queryParams.type || 'random';
    const isBreedSpecificDogOp = ['breedImage', 'breedImages', 'subBreeds', 'breedExists'].includes(selectedDogType);
    const isBreedFieldInDogs = isDogsEndpoint && param.name === 'breed';
    const isBreedRequiredForDogs = isBreedFieldInDogs && isBreedSpecificDogOp;
    const isBreedNotNeededInDogs = isBreedFieldInDogs && (selectedDogType === 'random' || selectedDogType === 'breedList');

    // Context-awareness for Jikan API
    const isJikanEndpoint = endpoint.id === 'jikan';
    const selectedJikanType = queryParams.type || 'anime';
    const JIKAN_ID_OPERATIONS = [
      'animeFull', 'animeCharacters', 'animeStaff', 'animeEpisodes', 'animeNews',
      'animeRecommendations', 'animeReviews', 'animePictures', 'animeVideos',
      'animeRelations', 'animeStreaming', 'mangaFull', 'mangaCharacters', 'mangaNews',
      'mangaRecommendations', 'mangaReviews', 'mangaPictures', 'characterFull',
      'characterPictures', 'personFull', 'personPictures'
    ];
    const isJikanValueRequired = isJikanEndpoint && param.name === 'value' && JIKAN_ID_OPERATIONS.includes(selectedJikanType);

    // Context-awareness for CoinGecko API
    const isCoingeckoEndpoint = endpoint.id === 'coingecko';
    const selectedCoingeckoType = queryParams.type || 'ping';
    const COINGECKO_ID_OPERATIONS = ['coin', 'exchange', 'exchangeTickers', 'nft'];
    const isCoingeckoValueRequired = isCoingeckoEndpoint && param.name === 'value' && COINGECKO_ID_OPERATIONS.includes(selectedCoingeckoType);
    const isCoingeckoValueNotNeeded = isCoingeckoEndpoint && param.name === 'value' && !COINGECKO_ID_OPERATIONS.includes(selectedCoingeckoType);

    const isRequired = (param.required && !isAllSelectedInCountries) || isBreedRequiredForDogs || isJikanValueRequired || isCoingeckoValueRequired;

    let customPlaceholder = param.placeholder || `Enter ${param.name}`;
    if (isValueFieldInCountries && isAllSelectedInCountries) {
      customPlaceholder = 'Not required for type=all';
    } else if (isBreedNotNeededInDogs) {
      customPlaceholder = `Not required for type=${selectedDogType}`;
    } else if (isDogsEndpoint && param.name === 'limit' && selectedDogType !== 'randomMultiple') {
      customPlaceholder = 'Used with type=randomMultiple';
    } else if (isJikanValueRequired) {
      customPlaceholder = `e.g. 1 (Required for ${selectedJikanType})`;
    } else if (isJikanEndpoint && param.name === 'value') {
      customPlaceholder = `e.g. 1 (ID for ${selectedJikanType}, or leave empty for list)`;
    } else if (isCoingeckoValueRequired) {
      customPlaceholder = `e.g. bitcoin (Required for ${selectedCoingeckoType})`;
    } else if (isCoingeckoValueNotNeeded) {
      customPlaceholder = `Not required for type=${selectedCoingeckoType}`;
    } else if (isCoingeckoEndpoint && param.name === 'query' && selectedCoingeckoType === 'search') {
      customPlaceholder = 'e.g. bitcoin (Used with type=search)';
    } else if (isCoingeckoEndpoint && param.name === 'ids' && selectedCoingeckoType === 'simplePrice') {
      customPlaceholder = 'e.g. bitcoin,ethereum (Used with simplePrice)';
    } else if (isCoingeckoEndpoint && param.name === 'vs_currencies' && selectedCoingeckoType === 'simplePrice') {
      customPlaceholder = 'e.g. usd,eur (Used with simplePrice)';
    } else if (isCoingeckoEndpoint && param.name === 'vs_currency' && (selectedCoingeckoType === 'markets' || selectedCoingeckoType === 'coinMarkets')) {
      customPlaceholder = `e.g. usd (Used with ${selectedCoingeckoType})`;
    }

    return (
      <div key={param.name} className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <label className="font-mono text-slate-900 dark:text-slate-100 font-semibold flex items-center space-x-1">
            <span>{param.name}</span>
            {isRequired && (
              <span className="text-rose-600 dark:text-rose-400 text-[10px]">*</span>
            )}
          </label>
          <span className={`text-[10px] ${isRequired ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
            {isRequired ? 'required' : 'optional'}
          </span>
        </div>

        {param.options && param.options.length > 0 ? (
          <select
            value={currentValue}
            onChange={e => updateQueryParam(param.name, e.target.value)}
            className="w-full px-3 py-2 min-h-[38px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 font-mono"
          >
            {!param.required && <option value="">(Default)</option>}
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
            placeholder={customPlaceholder}
            className={`w-full px-3 py-2 min-h-[38px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 font-mono ${
              (isValueFieldInCountries && isAllSelectedInCountries) ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          />
        )}
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {isValueFieldInCountries && isAllSelectedInCountries
            ? 'Omitted because type is set to all'
            : isBreedRequiredForDogs
            ? 'Required when operation is breed-specific'
            : isBreedNotNeededInDogs
            ? `Not needed when operation is ${selectedDogType}`
            : isJikanValueRequired
            ? `Required: Resource ID is required for "${selectedJikanType}"`
            : isJikanEndpoint && param.name === 'value'
            ? `Optional ID for ${selectedJikanType} (omit to retrieve list/search)`
            : isCoingeckoValueRequired
            ? `Required: Coin, exchange, or NFT ID is required for "${selectedCoingeckoType}"`
            : isCoingeckoValueNotNeeded
            ? `Not needed when operation is "${selectedCoingeckoType}"`
            : isCoingeckoEndpoint && param.name === 'query' && selectedCoingeckoType !== 'search'
            ? 'Search keyword (used when type=search)'
            : param.description}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-4 sm:p-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      {/* 1. PLAYGROUND HEADER & PRESETS (Hick's Law: 3-4 visible presets max) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Sliders size={14} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Interactive Playground</h2>
          </div>
        </div>

        {endpoint.presets.length > 0 && (
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">
              Presets:
            </span>
            {visiblePresets.map(preset => (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                className="px-2.5 py-1 min-h-[30px] text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-md border border-slate-200 dark:border-slate-700/80 transition-colors whitespace-nowrap shadow-2xs"
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
            {remainingPresetCount > 0 && !showAllPresets && (
              <button
                onClick={() => setShowAllPresets(true)}
                className="px-2 py-1 min-h-[30px] text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              >
                +{remainingPresetCount} more
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. PARAMETERS CONFIGURATION (Progressive Disclosure) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Parameters
          </span>
          {hasAnyParams && (
            <button
              onClick={resetParams}
              className="flex items-center space-x-1 px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              title="Reset parameters to defaults"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {!hasAnyParams ? (
          <div className="px-4 py-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>No required parameters for this endpoint. Default payload ready.</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">GET Ready</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Path Parameters (Only if exist) */}
            {hasPathParams && (
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Path Parameters
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {endpoint.pathParams.map(param => {
                    const currentValue = pathParams[param.name] ?? (param.defaultValue || '');
                    return (
                      <div key={param.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <label className="font-mono text-slate-900 dark:text-slate-100 font-semibold flex items-center space-x-1">
                            <span>:{param.name}</span>
                            {param.required && <span className="text-rose-600 dark:text-rose-400 text-[10px]">*</span>}
                          </label>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{param.type}</span>
                        </div>

                        {param.options && param.options.length > 0 ? (
                          <select
                            value={currentValue}
                            onChange={e => updatePathParam(param.name, e.target.value)}
                            className="w-full px-3 py-2 min-h-[38px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 font-mono"
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
                            className="w-full px-3 py-2 min-h-[38px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 font-mono"
                          />
                        )}
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{param.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Query Parameters (Only if exist) */}
            {hasQueryParams && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Query Parameters
                </span>

                {endpoint.id === 'rick-and-morty' ? (
                  <div className="space-y-4">
                    {/* 1. Core Resource & Lookup */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Core Resource & Lookup
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {endpoint.queryParams
                          .filter(p => ['resource', 'value', 'page'].includes(p.name))
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 2. Character Filters */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Character Filters
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">for resource=character</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {endpoint.queryParams
                          .filter(p => ['name', 'status', 'species', 'gender', 'type'].includes(p.name))
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 3. Location & Episode Specific Filters */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Location & Episode Filters
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">for resource=location | episode</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {endpoint.queryParams
                          .filter(p => ['dimension', 'episode'].includes(p.name))
                          .map(renderQueryParamInput)}
                      </div>
                    </div>
                  </div>
                ) : endpoint.id === 'coingecko' ? (
                  <div className="space-y-4">
                    {/* 1. Operation */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Operation
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {endpoint.queryParams
                          .filter(p => ['type', 'value'].includes(p.name))
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 2. Price / Market Parameters */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Price & Market Parameters
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">for simplePrice | markets | coinMarkets</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {endpoint.queryParams
                          .filter(p => ['ids', 'vs_currency', 'vs_currencies', 'order'].includes(p.name))
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 3. Pagination */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Pagination
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">for list & market queries</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {endpoint.queryParams
                          .filter(p => ['per_page', 'page'].includes(p.name))
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 4. Search */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Search
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">for type=search</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {endpoint.queryParams
                          .filter(p => ['query'].includes(p.name))
                          .map(renderQueryParamInput)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {endpoint.queryParams.map(renderQueryParamInput)}
                  </div>
                )}
              </div>
            )}

            {/* Custom Query Parameters */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Custom Parameters
                </span>
                <button
                  onClick={addCustomQueryParam}
                  className="flex items-center space-x-1 px-2.5 py-1 min-h-[32px] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <Plus size={12} />
                  <span>Add Param</span>
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
                        className="rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 focus:ring-slate-500 h-4 w-4"
                      />
                      <input
                        type="text"
                        value={item.key}
                        onChange={e => updateCustomQueryParam(item.id, { key: e.target.value })}
                        placeholder="Key (e.g. filter)"
                        className="w-1/3 px-2.5 py-1.5 min-h-[36px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-200 font-mono"
                      />
                      <input
                        type="text"
                        value={item.value}
                        onChange={e => updateCustomQueryParam(item.id, { value: e.target.value })}
                        placeholder="Value (e.g. active)"
                        className="flex-1 px-2.5 py-1.5 min-h-[36px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-800 dark:text-slate-200 font-mono"
                      />
                      <button
                        onClick={() => removeCustomQueryParam(item.id)}
                        className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-label="Remove parameter"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. REQUEST & EXECUTION SECTION (Separated from configuration) */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Request & Live URL
        </div>

        {/* Live URL Row */}
        <div className="flex flex-col sm:flex-row sm:items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 gap-2">
          <div className="flex items-center px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs shrink-0 self-start sm:self-auto">
            {endpoint.method}
          </div>

          <div className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate flex-1 px-2 py-1 select-all break-all sm:break-normal">
            {fullUrl}
          </div>

          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-800 transition-colors shadow-2xs self-end sm:self-auto"
            title="Open raw request in new tab"
            aria-label="Open in new tab"
          >
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Validation Warning Banner */}
        {validationError && (
          <div className="flex items-center space-x-2.5 px-3.5 py-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-lg text-xs text-amber-800 dark:text-amber-300 animate-in fade-in duration-150">
            <AlertCircle size={15} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="flex-1 font-medium">{validationError}</div>
          </div>
        )}

        {/* Primary Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Secondary Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyUrl}
              className="flex items-center space-x-1.5 px-3 py-2 min-h-[38px] bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 transition-colors shadow-2xs"
            >
              {copiedUrl ? (
                <>
                  <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">URL Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy URL</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyCurl}
              className="flex items-center space-x-1.5 px-3 py-2 min-h-[38px] bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 transition-colors shadow-2xs"
            >
              {copiedCurl ? (
                <>
                  <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">cURL Copied</span>
                </>
              ) : (
                <>
                  <Terminal size={14} />
                  <span>Copy cURL</span>
                </>
              )}
            </button>
          </div>

          {/* Dominant Primary Action: Send Request */}
          <button
            onClick={handleSendRequest}
            disabled={responseState.isLoading}
            className="flex items-center space-x-2 px-6 py-2.5 min-h-[42px] bg-slate-900 hover:bg-slate-800 active:bg-black dark:bg-slate-100 dark:hover:bg-white dark:active:bg-slate-200 text-white dark:text-slate-900 font-semibold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <Play size={14} className={responseState.isLoading ? 'animate-spin' : 'fill-current'} />
            <span>{responseState.isLoading ? 'Executing Request...' : 'Send Request'}</span>
            <kbd className="ml-2 px-1.5 py-0.5 bg-white/20 dark:bg-black/20 text-white dark:text-slate-900 rounded text-[10px] font-mono">
              ⌘↵
            </kbd>
          </button>
        </div>
      </div>

      {/* 4. RESPONSE OUTPUT SECTION */}
      <div ref={responseSectionRef} className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveBottomTab('response')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 min-h-[34px] rounded-md text-xs font-semibold transition-colors ${
                activeBottomTab === 'response'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Terminal size={13} />
              <span>Response</span>
            </button>

            <button
              onClick={() => setActiveBottomTab('snippets')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 min-h-[34px] rounded-md text-xs font-semibold transition-colors ${
                activeBottomTab === 'snippets'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Code2 size={13} />
              <span>Code Snippets</span>
            </button>
          </div>

          {responseState.status !== null && activeBottomTab === 'response' && (
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {responseState.timeMs !== null ? `${responseState.timeMs}ms` : ''}
            </span>
          )}
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
