export type HttpMethod = 'GET';

export type HttpParamType = 'string' | 'number' | 'boolean' | 'enum';

export interface ParamOption {
  label: string;
  value: string;
  description?: string;
}

export interface ParamDefinition {
  name: string;
  label?: string;
  type: HttpParamType;
  required: boolean;
  description: string;
  defaultValue?: string;
  options?: ParamOption[];
  placeholder?: string;
  example?: string;
  validationRule?: (val: string, allParams: Record<string, string>) => string | null;
}

export interface EndpointPreset {
  id: string;
  label: string;
  description: string;
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string>;
}

export interface StatusCodeDoc {
  code: number;
  title: string;
  description: string;
  responseExample?: any;
}

export type EndpointCategory = 'health' | 'fake' | 'mock' | 'geography' | 'weather' | 'pokemon' | 'rick-and-morty' | 'cat-facts' | 'dogs' | 'jikan' | 'coingecko' | 'ipify' | 'agify' | 'genderize' | 'nationalize';

export interface EndpointDefinition {
  id: string;
  category: EndpointCategory;
  categoryTitle: string;
  method: HttpMethod;
  path: string;
  title: string;
  shortDescription: string;
  description: string;
  notes?: string[];
  pathParams: ParamDefinition[];
  queryParams: ParamDefinition[];
  presets: EndpointPreset[];
  exampleRequestUrl: string;
  exampleCurl: string;
  responseExample: any;
  statusCodes: StatusCodeDoc[];
}

export interface DocSection {
  id: string;
  title: string;
  badge?: string;
  icon: string;
  description: string;
  content: string;
}

export interface RequestHistoryItem {
  id: string;
  timestamp: number;
  endpointId: string;
  endpointTitle: string;
  method: string;
  url: string;
  status: number;
  timeMs: number;
  sizeBytes?: number;
  pathParams: Record<string, string>;
  queryParams: Record<string, string>;
  responsePreview?: string;
}

export interface DeveloperProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

export interface DeveloperSettings {
  autoSendPreset: boolean;
  autoScrollToResponse: boolean;
  wrapLines: boolean;
  showTimingBreakdown: boolean;
  prettyPrintJson: boolean;
  saveHistory: boolean;
  defaultSnippetLang: 'curl' | 'fetch' | 'axios' | 'python';
}

export interface ApiResponseState {
  status: number | null;
  statusText: string;
  timeMs: number | null;
  sizeBytes: number | null;
  headers: Record<string, string>;
  data: any;
  rawText: string;
  isJson: boolean;
  error: string | null;
  timestamp: number;
  requestUrl: string;
  isLoading: boolean;
}

