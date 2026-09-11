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

      // Special check: for github endpoint, omit default type=users and non-applicable fields
      if (endpoint.id === 'github') {
        const op = queryParams.type || 'users';
        if (key === 'type' && (val === 'users' || val === '')) {
          return; // 'users' is the default operation, produces clean /github
        }
        const isUserOp = ['user', 'userRepos'].includes(op);
        const isRepoOp = [
          'repos', 'repoIssues', 'repoPulls', 'repoCommits', 'repoBranches',
          'repoReleases', 'repoTags', 'repoLanguages', 'repoContributors', 'repoContents'
        ].includes(op);
        const isSearchOp = ['searchRepositories', 'searchUsers', 'searchIssues', 'searchCommits'].includes(op);

        if ((key === 'username' || key === 'value') && !isUserOp) {
          return;
        }
        if ((key === 'owner' || key === 'repo') && !isRepoOp) {
          return;
        }
        if (key === 'state' && op !== 'repoIssues' && op !== 'repoPulls') {
          return;
        }
        if (key === 'q' && !isSearchOp) {
          return;
        }
      }

      // Special check: for open-library endpoint, omit default type=search (when empty) and non-applicable fields
      if (endpoint.id === 'open-library') {
        const op = queryParams.type || 'search';
        const isSearchOp = op === 'search';
        const isIdOp = ['work', 'edition', 'author', 'subject', 'isbn'].includes(op);

        if (key === 'type' && (val === 'search' || val === '')) {
          const hasSearchParam = (queryParams.q && queryParams.q.trim()) || (queryParams.title && queryParams.title.trim());
          if (!hasSearchParam) {
            return; // clean /open-library for default search with no parameters
          }
        }

        if ((key === 'q' || key === 'title') && !isSearchOp) {
          return;
        }
        if (key === 'value' && !isIdOp) {
          return;
        }
      }

      // Special check: for gutendex endpoint, omit default type=books (when no search) and non-applicable fields
      if (endpoint.id === 'gutendex') {
        const op = queryParams.type || 'books';
        const isBooksOp = op === 'books';
        const isBookIdOp = op === 'book';

        if (key === 'type' && (val === 'books' || val === '')) {
          const hasSearchParam = queryParams.search && queryParams.search.trim();
          if (!hasSearchParam) {
            return; // clean /gutendex for default books with no search parameter
          }
        }

        if (key === 'search' && !isBooksOp) {
          return;
        }
        if (key === 'value' && !isBookIdOp) {
          return;
        }
      }

      // Special check: for open-food-facts endpoint, omit non-applicable fields
      if (endpoint.id === 'open-food-facts') {
        const op = queryParams.type || 'product';
        const isProductsOp = op === 'products';
        const isIdentifierOp = [
          'product', 'category', 'brand', 'ingredient', 'additive',
          'allergen', 'label', 'packagingMaterial'
        ].includes(op);

        if ((key === 'search_terms' || key === 'categories_tags_en') && !isProductsOp) {
          return;
        }
        if (key === 'value' && !isIdentifierOp) {
          return;
        }
      }

      // Special check: for meal-db endpoint, omit default type=random and non-applicable fields
      if (endpoint.id === 'meal-db') {
        const op = queryParams.type || 'random';
        if (key === 'type' && (val === 'random' || val === '')) {
          return; // 'random' is default operation, produces clean /meal-db
        }
        const isNoParamOp = ['random', 'randomSelection', 'categories', 'areas', 'ingredients'].includes(op);
        const isValueOp = ['lookup', 'search'].includes(op);
        const isFilterOp = op === 'filter';

        if (isNoParamOp && (key === 'value' || key === 'category' || key === 'area' || key === 'ingredient')) {
          return;
        }
        if (isValueOp && (key === 'category' || key === 'area' || key === 'ingredient')) {
          return;
        }
        if (isFilterOp && key === 'value') {
          return;
        }
      }

      // Special check: for cocktail-db endpoint, omit default type=random and non-applicable fields
      if (endpoint.id === 'cocktail-db') {
        const op = queryParams.type || 'random';
        if (key === 'type' && (val === 'random' || val === '')) {
          return; // 'random' is default operation, produces clean /cocktail-db
        }
        const isNoParamOp = ['random', 'randomMultiple', 'categories', 'glass', 'ingredients', 'alcoholic'].includes(op);
        const isValueOp = ['lookup', 'search'].includes(op);
        const isFilterOp = op === 'filter';

        if (isNoParamOp && (key === 'value' || key === 'ingredient' || key === 'category' || key === 'alcoholic' || key === 'glass')) {
          return;
        }
        if (isValueOp && (key === 'ingredient' || key === 'category' || key === 'alcoholic' || key === 'glass')) {
          return;
        }
        if (isFilterOp && key === 'value') {
          return;
        }
      }

      // Special check: for joke-api endpoint, omit default type=random (when empty) and filter non-applicable fields
      if (endpoint.id === 'joke-api') {
        const op = queryParams.type || 'random';
        if (key === 'type' && (val === 'random' || val === '')) {
          const hasExtraParams = Boolean(
            (queryParams.value && queryParams.value.trim()) ||
            (queryParams.amount && queryParams.amount.trim()) ||
            (queryParams.format && queryParams.format.trim()) ||
            (queryParams.blacklistFlags && queryParams.blacklistFlags.trim()) ||
            (queryParams.safe && queryParams.safe.trim()) ||
            (queryParams.lang && queryParams.lang.trim())
          );
          if (!hasExtraParams) {
            return; // clean /joke-api for default random joke
          }
        }

        // For joke operation (joke by ID), omit filter-specific params unless provided
        if (op === 'joke') {
          if (key === 'blacklistFlags' || key === 'safe') {
            return;
          }
        }

        // Map format field to query string 'format' or 'jokeType'
        if (key === 'format') {
          if (!val.trim()) return;
          searchParams.append('format', val.trim());
          return;
        }
      }

      // Special check: for official-joke endpoint
      if (endpoint.id === 'official-joke') {
        const op = queryParams.type || 'random';
        if (key === 'type' && (val === 'random' || val === '')) {
          const hasValue = Boolean(queryParams.value && queryParams.value.trim());
          if (!hasValue) {
            return; // clean /official-joke for default random joke
          }
        }

        const isNoParamOp = ['random', 'randomTen', 'ten', 'types'].includes(op);
        if (isNoParamOp && (key === 'value' || key === 'mode')) {
          return;
        }

        if (op === 'randomMultiple' && key === 'mode') {
          return;
        }

        if (op === 'joke' && key === 'mode') {
          return;
        }

        if (op === 'byType' && key === 'mode') {
          if (!val.trim() || val === 'random') {
            return; // mode=random is default, omit unless ten
          }
        }
      }

      // Special check: for random-user endpoint
      if (endpoint.id === 'random-user') {
        if (key === 'type' && (val === 'random' || val === '')) {
          return; // clean /random-user without type=random
        }

        if (key === 'gender' && (!val.trim() || val === 'any')) {
          return; // omit when Any or empty
        }

        if (key === 'noinfo') {
          if (val === 'true') {
            searchParams.append('noinfo', 'true');
          }
          return;
        }
      }

      // Special check: for bored endpoint
      if (endpoint.id === 'bored') {
        const op = queryParams.operation || 'random';
        if (op === 'random') {
          return; // clean /bored without operation=random or stale filter/activity params
        }

        if (op === 'filter') {
          if (key === 'value') return;
          if (key === 'operation') {
            searchParams.append('operation', 'filter');
            return;
          }
        }

        if (op === 'activity') {
          if (key === 'type' || key === 'participants') return;
          if (key === 'operation') {
            searchParams.append('operation', 'activity');
            return;
          }
        }
      }

      // Special check: for deck-of-cards endpoint
      if (endpoint.id === 'deck-of-cards') {
        const op = queryParams.operation || 'newShuffle';

        if (op === 'new') {
          if (!['operation', 'deckCount', 'jokersEnabled'].includes(key)) return;
          if (key === 'jokersEnabled' && val !== 'true') return;
        } else if (op === 'newShuffle') {
          if (!['operation', 'deckCount', 'jokersEnabled'].includes(key)) return;
          if (key === 'jokersEnabled' && val !== 'true') return;
          if (key === 'operation') {
            const hasDeckCount = !!(queryParams.deckCount && queryParams.deckCount.trim());
            const hasJokers = queryParams.jokersEnabled === 'true';
            if (!hasDeckCount && !hasJokers) {
              return; // clean /deck-of-cards
            }
          }
        } else if (op === 'draw') {
          if (!['operation', 'deckId', 'count'].includes(key)) return;
        } else if (op === 'shuffle') {
          if (!['operation', 'deckId', 'remaining'].includes(key)) return;
          if (key === 'remaining' && val !== 'true') return;
        } else if (op === 'return') {
          if (!['operation', 'deckId', 'cards'].includes(key)) return;
        } else if (op === 'pileAdd') {
          if (!['operation', 'deckId', 'pileName', 'cards'].includes(key)) return;
        } else if (op === 'pileShuffle') {
          if (!['operation', 'deckId', 'pileName'].includes(key)) return;
        } else if (op === 'pileList') {
          if (!['operation', 'deckId', 'pileName'].includes(key)) return;
        } else if (op === 'pileDraw') {
          if (!['operation', 'deckId', 'pileName', 'count'].includes(key)) return;
        } else if (op === 'pileReturn') {
          if (!['operation', 'deckId', 'pileName'].includes(key)) return;
        }
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
