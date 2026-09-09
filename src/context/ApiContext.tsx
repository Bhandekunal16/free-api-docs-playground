import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EndpointDefinition, EndpointPreset, RequestHistoryItem, ApiResponseState, DeveloperSettings, DeveloperProfile } from '../types/api';
import { API_ENDPOINTS, getEndpointById } from '../data/apiEndpoints';
import { DEFAULT_BASE_URL, normalizeBaseUrl, buildUrl, formatBytes } from '../utils/url';

interface ActiveSelection {
  type: 'endpoint' | 'doc';
  id: string;
}

interface CustomQueryParam {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export const DEFAULT_DEVELOPER_SETTINGS: DeveloperSettings = {
  autoSendPreset: false,
  autoScrollToResponse: true,
  wrapLines: true,
  showTimingBreakdown: true,
  prettyPrintJson: true,
  saveHistory: true,
  defaultSnippetLang: 'curl'
};

export const DEFAULT_DEVELOPER_PROFILE: DeveloperProfile = {
  name: 'Developer Sandbox',
  email: 'bhandekunal16@gmail.com',
  role: 'API Engineer'
};

interface ApiContextType {
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  activeSelection: ActiveSelection;
  setActiveSelection: (selection: ActiveSelection) => void;
  activeEndpoint: EndpointDefinition | undefined;
  pathParams: Record<string, string>;
  setPathParams: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  updatePathParam: (key: string, val: string) => void;
  queryParams: Record<string, string>;
  setQueryParams: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  updateQueryParam: (key: string, val: string) => void;
  customQueryParams: CustomQueryParam[];
  addCustomQueryParam: () => void;
  updateCustomQueryParam: (id: string, updates: Partial<CustomQueryParam>) => void;
  removeCustomQueryParam: (id: string) => void;
  responseState: ApiResponseState;
  executeRequest: () => Promise<void>;
  resetParams: () => void;
  applyPreset: (preset: EndpointPreset) => void;
  history: RequestHistoryItem[];
  clearHistory: () => void;
  loadHistoryItem: (item: RequestHistoryItem) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  serverHealth: 'checking' | 'healthy' | 'unhealthy';
  checkServerHealth: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  layoutMode: 'split' | 'docs' | 'playground';
  setLayoutMode: (mode: 'split' | 'docs' | 'playground') => void;
  activeSnippetTab: 'curl' | 'fetch' | 'axios' | 'python';
  setActiveSnippetTab: (tab: 'curl' | 'fetch' | 'axios' | 'python') => void;
  settings: DeveloperSettings;
  updateSetting: <K extends keyof DeveloperSettings>(key: K, value: DeveloperSettings[K]) => void;
  resetSettings: () => void;
  profile: DeveloperProfile;
  updateProfile: (updates: Partial<DeveloperProfile>) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const INITIAL_RESPONSE: ApiResponseState = {
  status: null,
  statusText: '',
  timeMs: null,
  sizeBytes: null,
  headers: {},
  data: null,
  rawText: '',
  isJson: false,
  error: null,
  timestamp: 0,
  requestUrl: '',
  isLoading: false
};

const BASE_URL_STORAGE_KEY = 'free_api_server_base_url';
const HISTORY_STORAGE_KEY = 'free_api_server_history_v1';
const SETTINGS_STORAGE_KEY = 'free_api_server_settings_v1';
const PROFILE_STORAGE_KEY = 'free_api_server_profile_v1';

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseUrl, setBaseUrlState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(BASE_URL_STORAGE_KEY);
      return stored ? normalizeBaseUrl(stored) : DEFAULT_BASE_URL;
    } catch {
      return DEFAULT_BASE_URL;
    }
  });

  const [settings, setSettings] = useState<DeveloperSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? { ...DEFAULT_DEVELOPER_SETTINGS, ...JSON.parse(stored) } : DEFAULT_DEVELOPER_SETTINGS;
    } catch {
      return DEFAULT_DEVELOPER_SETTINGS;
    }
  });

  const [profile, setProfile] = useState<DeveloperProfile>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      return stored ? { ...DEFAULT_DEVELOPER_PROFILE, ...JSON.parse(stored) } : DEFAULT_DEVELOPER_PROFILE;
    } catch {
      return DEFAULT_DEVELOPER_PROFILE;
    }
  });

  const updateSetting = useCallback(<K extends keyof DeveloperSettings>(key: K, value: DeveloperSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_DEVELOPER_SETTINGS);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_DEVELOPER_SETTINGS));
    } catch {
      // ignore
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<DeveloperProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const [activeSelection, setActiveSelection] = useState<ActiveSelection>({
    type: 'endpoint',
    id: 'health-check'
  });

  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [customQueryParams, setCustomQueryParams] = useState<CustomQueryParam[]>([]);
  const [responseState, setResponseState] = useState<ApiResponseState>(INITIAL_RESPONSE);
  const [history, setHistory] = useState<RequestHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [serverHealth, setServerHealth] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<'split' | 'docs' | 'playground'>('split');
  const [activeSnippetTab, setActiveSnippetTab] = useState<'curl' | 'fetch' | 'axios' | 'python'>('curl');

  const setBaseUrl = useCallback((newUrl: string) => {
    const normalized = normalizeBaseUrl(newUrl);
    setBaseUrlState(normalized);
    try {
      localStorage.setItem(BASE_URL_STORAGE_KEY, normalized);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const activeEndpoint = activeSelection.type === 'endpoint'
    ? getEndpointById(activeSelection.id) || API_ENDPOINTS[0]
    : undefined;

  // Initialize parameters when active endpoint changes
  useEffect(() => {
    if (!activeEndpoint) return;

    const initialPath: Record<string, string> = {};
    activeEndpoint.pathParams.forEach(p => {
      initialPath[p.name] = p.defaultValue !== undefined ? String(p.defaultValue) : (p.options?.[0]?.value || '');
    });
    setPathParams(initialPath);

    const initialQuery: Record<string, string> = {};
    activeEndpoint.queryParams.forEach(q => {
      if (q.defaultValue !== undefined) {
        initialQuery[q.name] = String(q.defaultValue);
      }
    });
    setQueryParams(initialQuery);
    setCustomQueryParams([]);
    // Do not clear response immediately so user can still see last output if they want, but reset loading
    setResponseState(prev => ({ ...prev, isLoading: false }));
  }, [activeEndpoint?.id]);

  const updatePathParam = useCallback((key: string, val: string) => {
    setPathParams(prev => ({ ...prev, [key]: val }));
  }, []);

  const updateQueryParam = useCallback((key: string, val: string) => {
    setQueryParams(prev => ({ ...prev, [key]: val }));
  }, []);

  const addCustomQueryParam = useCallback(() => {
    const newId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setCustomQueryParams(prev => [...prev, { id: newId, key: '', value: '', enabled: true }]);
  }, []);

  const updateCustomQueryParam = useCallback((id: string, updates: Partial<CustomQueryParam>) => {
    setCustomQueryParams(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const removeCustomQueryParam = useCallback((id: string) => {
    setCustomQueryParams(prev => prev.filter(item => item.id !== id));
  }, []);

  const resetParams = useCallback(() => {
    if (!activeEndpoint) return;
    const initialPath: Record<string, string> = {};
    activeEndpoint.pathParams.forEach(p => {
      initialPath[p.name] = p.defaultValue !== undefined ? String(p.defaultValue) : (p.options?.[0]?.value || '');
    });
    setPathParams(initialPath);

    const initialQuery: Record<string, string> = {};
    activeEndpoint.queryParams.forEach(q => {
      if (q.defaultValue !== undefined) {
        initialQuery[q.name] = String(q.defaultValue);
      }
    });
    setQueryParams(initialQuery);
    setCustomQueryParams([]);
  }, [activeEndpoint]);

  const applyPreset = useCallback((preset: EndpointPreset) => {
    if (preset.pathParams) {
      setPathParams(prev => ({ ...prev, ...preset.pathParams }));
    }
    if (preset.queryParams) {
      setQueryParams(prev => ({ ...prev, ...preset.queryParams }));
    }
  }, []);

  // Ping server health
  const checkServerHealth = useCallback(async () => {
    setServerHealth('checking');
    try {
      const norm = normalizeBaseUrl(baseUrl);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${norm}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok || res.status < 500) {
        setServerHealth('healthy');
      } else {
        setServerHealth('unhealthy');
      }
    } catch {
      setServerHealth('unhealthy');
    }
  }, [baseUrl]);

  useEffect(() => {
    checkServerHealth();
  }, [checkServerHealth]);

  // Execute Request
  const executeRequest = useCallback(async () => {
    if (!activeEndpoint) return;

    const { fullUrl } = buildUrl(
      baseUrl,
      activeEndpoint,
      pathParams,
      queryParams,
      customQueryParams
    );

    setResponseState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      requestUrl: fullUrl
    }));

    const startTime = performance.now();
    const headersMap: Record<string, string> = {};

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);

      // Extract headers
      response.headers.forEach((val, key) => {
        headersMap[key] = val;
      });

      const contentType = response.headers.get('content-type') || '';
      let parsedData: any = null;
      let rawText = '';
      let isJson = false;

      rawText = await response.text();
      const sizeBytes = new Blob([rawText]).size;

      if (contentType.includes('application/json') || rawText.trim().startsWith('{') || rawText.trim().startsWith('[')) {
        try {
          parsedData = JSON.parse(rawText);
          isJson = true;
        } catch {
          parsedData = rawText;
          isJson = false;
        }
      } else {
        parsedData = rawText;
        isJson = false;
      }

      const newState: ApiResponseState = {
        status: response.status,
        statusText: response.statusText || (response.ok ? 'OK' : 'Error'),
        timeMs,
        sizeBytes,
        headers: headersMap,
        data: parsedData,
        rawText,
        isJson,
        error: response.ok ? null : (parsedData?.message || `HTTP ${response.status} ${response.statusText}`),
        timestamp: Date.now(),
        requestUrl: fullUrl,
        isLoading: false
      };

      setResponseState(newState);

      // Record in history
      const historyItem: RequestHistoryItem = {
        id: `req_${Date.now()}`,
        timestamp: Date.now(),
        endpointId: activeEndpoint.id,
        endpointTitle: activeEndpoint.title,
        method: activeEndpoint.method,
        url: fullUrl,
        status: response.status,
        timeMs,
        sizeBytes,
        pathParams: { ...pathParams },
        queryParams: { ...queryParams },
        responsePreview: isJson ? JSON.stringify(parsedData).slice(0, 100) : rawText.slice(0, 100)
      };

      if (settings.saveHistory) {
        setHistory(prev => {
          const updated = [historyItem, ...prev.slice(0, 29)];
          try {
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      }

    } catch (err: any) {
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);

      let errorMessage = 'Network request failed';
      if (err.name === 'AbortError') {
        errorMessage = 'Request timeout after 20 seconds';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setResponseState({
        status: 0,
        statusText: 'Client Network / CORS Error',
        timeMs,
        sizeBytes: 0,
        headers: {},
        data: null,
        rawText: errorMessage,
        isJson: false,
        error: errorMessage,
        timestamp: Date.now(),
        requestUrl: fullUrl,
        isLoading: false
      });
    }
  }, [activeEndpoint, baseUrl, pathParams, queryParams, customQueryParams, settings.saveHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const loadHistoryItem = useCallback((item: RequestHistoryItem) => {
    setActiveSelection({ type: 'endpoint', id: item.endpointId });
    setPathParams(item.pathParams || {});
    setQueryParams(item.queryParams || {});
    setCustomQueryParams([]);
  }, []);

  return (
    <ApiContext.Provider
      value={{
        baseUrl,
        setBaseUrl,
        activeSelection,
        setActiveSelection,
        activeEndpoint,
        pathParams,
        setPathParams,
        updatePathParam,
        queryParams,
        setQueryParams,
        updateQueryParam,
        customQueryParams,
        addCustomQueryParam,
        updateCustomQueryParam,
        removeCustomQueryParam,
        responseState,
        executeRequest,
        resetParams,
        applyPreset,
        history,
        clearHistory,
        loadHistoryItem,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        serverHealth,
        checkServerHealth,
        searchQuery,
        setSearchQuery,
        layoutMode,
        setLayoutMode,
        activeSnippetTab,
        setActiveSnippetTab,
        settings,
        updateSetting,
        resetSettings,
        profile,
        updateProfile
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export function useApi(): ApiContextType {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
