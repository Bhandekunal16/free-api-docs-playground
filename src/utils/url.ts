import { EndpointDefinition } from '../types/api';

export const DEFAULT_BASE_URL = 'https://free-api-server.vercel.app';

/**
 * Normalizes a base URL by removing trailing slashes and ensuring a valid protocol prefix.
 */
export function normalizeBaseUrl(url: string): string {
  if (!url || !url.trim()) {
    return DEFAULT_BASE_URL;
  }
  let normalized = url.trim();
  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, '');
  // If protocol missing, prefix https://
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  return normalized;
}

/**
 * Constructs the final resolved path replacing path parameters like :type, :id, :subtype
 */
export function resolvePath(
  pathTemplate: string,
  pathParams: Record<string, string>
): string {
  let resolved = pathTemplate;
  Object.entries(pathParams).forEach(([key, value]) => {
    const encoded = encodeURIComponent(value || '');
    resolved = resolved.replace(new RegExp(`:${key}\\b`, 'g'), encoded || `:${key}`);
  });
  return resolved;
}

/**
 * Builds the complete URL from base URL, path parameters, and query parameters.
 */
export function buildUrl(
  baseUrl: string,
  endpoint: EndpointDefinition,
  pathParams: Record<string, string>,
  queryParams: Record<string, string>,
  customQueryParams: { key: string; value: string; enabled: boolean }[] = []
): { fullUrl: string; resolvedPath: string; searchParams: URLSearchParams } {
  const normBase = normalizeBaseUrl(baseUrl);
  const resolvedPath = resolvePath(endpoint.path, pathParams);

  // Construct query parameters
  const searchParams = new URLSearchParams();

  // Add standard endpoint query params
  Object.entries(queryParams).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val.trim() !== '') {
      // Special check: for countries endpoint with type=all, value is not required
      if (endpoint.id === 'countries' && queryParams.type === 'all' && key === 'value') {
        return; // skip value when type is 'all'
      }
      searchParams.append(key, val.trim());
    }
  });

  // Add enabled custom query parameters
  customQueryParams.forEach(({ key, value, enabled }) => {
    if (enabled && key.trim() && value.trim()) {
      searchParams.append(key.trim(), value.trim());
    }
  });

  const queryString = searchParams.toString();
  const cleanPath = resolvedPath.startsWith('/') ? resolvedPath : `/${resolvedPath}`;
  const fullUrl = `${normBase}${cleanPath}${queryString ? `?${queryString}` : ''}`;

  return { fullUrl, resolvedPath: cleanPath, searchParams };
}

/**
 * Generates cURL command for the request
 */
export function generateCurl(fullUrl: string): string {
  return `curl -X GET "${fullUrl}" \\
  -H "Accept: application/json"`;
}

/**
 * Generates JavaScript Fetch snippet
 */
export function generateFetchSnippet(fullUrl: string): string {
  return `// JavaScript (Fetch API)
const response = await fetch("${fullUrl}", {
  method: "GET",
  headers: {
    "Accept": "application/json"
  }
});

const data = await response.json();
console.log(data);`;
}

/**
 * Generates Axios snippet
 */
export function generateAxiosSnippet(fullUrl: string): string {
  return `// JavaScript (Axios)
import axios from "axios";

try {
  const response = await axios.get("${fullUrl}", {
    headers: {
      "Accept": "application/json"
    }
  });
  console.log(response.data);
} catch (error) {
  console.error("API Error:", error.response?.data || error.message);
}`;
}

/**
 * Generates Python Requests snippet
 */
export function generatePythonSnippet(fullUrl: string): string {
  return `# Python (requests)
import requests

url = "${fullUrl}"
headers = {
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`;
}

/**
 * Formats byte count to readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
