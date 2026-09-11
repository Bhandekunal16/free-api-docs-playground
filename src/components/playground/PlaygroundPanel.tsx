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
  AlertCircle,
  Lock,
  AlertTriangle
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

    // Validate GitHub endpoint
    if (endpoint.id === 'github') {
      const op = queryParams.type || 'users';
      const isUserOp = ['user', 'userRepos'].includes(op);
      const isRepoOp = [
        'repos', 'repoIssues', 'repoPulls', 'repoCommits', 'repoBranches',
        'repoReleases', 'repoTags', 'repoLanguages', 'repoContributors', 'repoContents'
      ].includes(op);
      const isSearchOp = ['searchRepositories', 'searchUsers', 'searchIssues', 'searchCommits'].includes(op);

      if (isUserOp) {
        const hasUsername = (queryParams.username && queryParams.username.trim()) || (queryParams.value && queryParams.value.trim());
        if (!hasUsername) {
          setValidationError('Username is required for this operation (e.g. "octocat").');
          return;
        }
      } else if (isRepoOp) {
        if (!queryParams.owner || !queryParams.owner.trim()) {
          setValidationError('Owner is required (e.g. "octocat").');
          return;
        }
        if (!queryParams.repo || !queryParams.repo.trim()) {
          setValidationError('Repository name is required (e.g. "Hello-World").');
          return;
        }
      } else if (isSearchOp) {
        if (!queryParams.q || !queryParams.q.trim()) {
          setValidationError('Search query (q) is required (e.g. "javascript").');
          return;
        }
      }
    }

    // Validate Open Library endpoint
    if (endpoint.id === 'open-library') {
      const op = queryParams.type || 'search';
      const isIdOp = ['work', 'edition', 'author', 'subject', 'isbn'].includes(op);
      if (isIdOp && (!queryParams.value || !queryParams.value.trim())) {
        const idLabel =
          op === 'work' ? 'work ID (e.g. "OL45804W")' :
          op === 'edition' ? 'edition ID (e.g. "OL7353617M")' :
          op === 'author' ? 'author ID (e.g. "OL23919A")' :
          op === 'subject' ? 'subject (e.g. "science_fiction")' :
          'ISBN (e.g. "9780140328721")';
        setValidationError(`The "${op}" operation requires an identifier in the "Value / Identifier" field (${idLabel}).`);
        return;
      }
    }

    // Validate Gutendex endpoint
    if (endpoint.id === 'gutendex') {
      const op = queryParams.type || 'books';
      if (op === 'book' && (!queryParams.value || !queryParams.value.trim())) {
        setValidationError('The "book" operation requires a book ID in the "Book ID (value)" field (e.g. "11").');
        return;
      }
    }

    // Validate Open Food Facts endpoint
    if (endpoint.id === 'open-food-facts') {
      const op = queryParams.type || 'product';
      const isIdOp = [
        'product', 'category', 'brand', 'ingredient', 'additive',
        'allergen', 'label', 'packagingMaterial'
      ].includes(op);
      if (isIdOp && (!queryParams.value || !queryParams.value.trim())) {
        const idLabel =
          op === 'product' ? 'product barcode (e.g. "737628064502")' :
          op === 'category' ? 'category identifier (e.g. "beverages")' :
          op === 'brand' ? 'brand identifier (e.g. "nestle")' :
          op === 'ingredient' ? 'ingredient identifier (e.g. "en:sugar")' :
          op === 'additive' ? 'additive identifier (e.g. "en:e330")' :
          op === 'allergen' ? 'allergen identifier (e.g. "en:peanuts")' :
          op === 'label' ? 'label identifier (e.g. "en:organic")' :
          'packaging material identifier (e.g. "en:plastic")';
        setValidationError(`The "${op}" operation requires an identifier in the "Identifier (value)" field (${idLabel}).`);
        return;
      }
    }

    // Validate TheMealDB endpoint
    if (endpoint.id === 'meal-db') {
      const op = queryParams.type || 'random';
      if (op === 'lookup' && (!queryParams.value || !queryParams.value.trim())) {
        setValidationError('Meal ID is required for lookup operation (e.g. "52772").');
        return;
      }
      if (op === 'search' && (!queryParams.value || !queryParams.value.trim())) {
        setValidationError('Meal Name is required for search operation (e.g. "Arrabiata").');
        return;
      }
      if (op === 'filter') {
        const hasCategory = Boolean(queryParams.category && queryParams.category.trim());
        const hasArea = Boolean(queryParams.area && queryParams.area.trim());
        const hasIngredient = Boolean(queryParams.ingredient && queryParams.ingredient.trim());
        if (!hasCategory && !hasArea && !hasIngredient) {
          setValidationError('The "filter" operation requires at least one filter: Category, Area / Cuisine, or Ingredient.');
          return;
        }
      }
    }

    // Validate TheCocktailDB endpoint
    if (endpoint.id === 'cocktail-db') {
      const op = queryParams.type || 'random';
      if (op === 'lookup' && (!queryParams.value || !queryParams.value.trim())) {
        setValidationError('Cocktail ID is required for lookup operation (e.g. "11007").');
        return;
      }
      if (op === 'search' && (!queryParams.value || !queryParams.value.trim())) {
        setValidationError('Cocktail Name is required for search operation (e.g. "margarita").');
        return;
      }
      if (op === 'filter') {
        const hasIngredient = Boolean(queryParams.ingredient && queryParams.ingredient.trim());
        const hasCategory = Boolean(queryParams.category && queryParams.category.trim());
        const hasAlcoholic = Boolean(queryParams.alcoholic && queryParams.alcoholic.trim());
        const hasGlass = Boolean(queryParams.glass && queryParams.glass.trim());
        if (!hasIngredient && !hasCategory && !hasAlcoholic && !hasGlass) {
          setValidationError('The "filter" operation requires at least one filter: Ingredient, Category, Alcoholic, or Glass.');
          return;
        }
      }
    }

    // Validate JokeAPI endpoint
    if (endpoint.id === 'joke-api') {
      const op = queryParams.type || 'random';
      if (op === 'joke' && (!queryParams.value || !queryParams.value.trim())) {
        setValidationError('Joke ID is required.');
        return;
      }
      if (op === 'category' && (!queryParams.value || !queryParams.value.trim())) {
        setValidationError('Category is required.');
        return;
      }
      if (op === 'categories' && (!queryParams.value || !queryParams.value.trim())) {
        setValidationError('At least one category is required (e.g. "Programming,Misc").');
        return;
      }
      if (op === 'filter' && (!queryParams.value || !queryParams.value.trim())) {
        setValidationError('Category is required for filter operation (e.g. "Programming").');
        return;
      }
    }

    // Validate Official Joke API endpoint
    if (endpoint.id === 'official-joke') {
      const op = queryParams.type || 'random';
      if (op === 'randomMultiple') {
        const val = queryParams.value?.trim();
        if (!val) {
          setValidationError('Count is required for randomMultiple operation.');
          return;
        }
        const num = Number(val);
        if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
          setValidationError('Count must be a positive integer (e.g. 5).');
          return;
        }
      }
      if (op === 'byType') {
        if (!queryParams.value || !queryParams.value.trim()) {
          setValidationError('Joke type is required (e.g. "programming").');
          return;
        }
        if (queryParams.mode && !['', 'random', 'ten'].includes(queryParams.mode)) {
          setValidationError('Mode must be "random" or "ten".');
          return;
        }
      }
      if (op === 'joke') {
        if (!queryParams.value || !queryParams.value.trim()) {
          setValidationError('Joke ID is required (e.g. "1").');
          return;
        }
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

    // Context-awareness for GitHub API
    const isGithubEndpoint = endpoint.id === 'github';
    const selectedGithubType = queryParams.type || 'users';
    const isGithubUserOp = ['user', 'userRepos'].includes(selectedGithubType);
    const isGithubRepoOp = [
      'repos', 'repoIssues', 'repoPulls', 'repoCommits', 'repoBranches',
      'repoReleases', 'repoTags', 'repoLanguages', 'repoContributors', 'repoContents'
    ].includes(selectedGithubType);
    const isGithubSearchOp = ['searchRepositories', 'searchUsers', 'searchIssues', 'searchCommits'].includes(selectedGithubType);

    const isGithubUsernameRequired = isGithubEndpoint && param.name === 'username' && isGithubUserOp;
    const isGithubOwnerRequired = isGithubEndpoint && param.name === 'owner' && isGithubRepoOp;
    const isGithubRepoRequired = isGithubEndpoint && param.name === 'repo' && isGithubRepoOp;
    const isGithubQueryRequired = isGithubEndpoint && param.name === 'q' && isGithubSearchOp;

    // Context-awareness for Open Library API
    const isOpenLibraryEndpoint = endpoint.id === 'open-library';
    const selectedOpenLibraryType = queryParams.type || 'search';
    const isOpenLibraryIdOp = ['work', 'edition', 'author', 'subject', 'isbn'].includes(selectedOpenLibraryType);
    const isOpenLibraryValueRequired = isOpenLibraryEndpoint && param.name === 'value' && isOpenLibraryIdOp;

    // Context-awareness for Gutendex API
    const isGutendexEndpoint = endpoint.id === 'gutendex';
    const selectedGutendexType = queryParams.type || 'books';
    const isGutendexValueRequired = isGutendexEndpoint && param.name === 'value' && selectedGutendexType === 'book';

    // Context-awareness for Open Food Facts API
    const isOpenFoodFactsEndpoint = endpoint.id === 'open-food-facts';
    const selectedOpenFoodFactsType = queryParams.type || 'product';
    const isOpenFoodFactsIdOp = [
      'product', 'category', 'brand', 'ingredient', 'additive',
      'allergen', 'label', 'packagingMaterial'
    ].includes(selectedOpenFoodFactsType);
    const isOpenFoodFactsValueRequired = isOpenFoodFactsEndpoint && param.name === 'value' && isOpenFoodFactsIdOp;

    // Context-awareness for TheMealDB API
    const isMealDbEndpoint = endpoint.id === 'meal-db';
    const selectedMealDbType = queryParams.type || 'random';
    const isMealDbValueRequired = isMealDbEndpoint && param.name === 'value' && ['lookup', 'search'].includes(selectedMealDbType);

    // Context-awareness for TheCocktailDB API
    const isCocktailDbEndpoint = endpoint.id === 'cocktail-db';
    const selectedCocktailDbType = queryParams.type || 'random';
    const isCocktailDbValueRequired = isCocktailDbEndpoint && param.name === 'value' && ['lookup', 'search'].includes(selectedCocktailDbType);

    // Context-awareness for JokeAPI
    const isJokeApiEndpoint = endpoint.id === 'joke-api';
    const selectedJokeApiType = queryParams.type || 'random';
    const isJokeApiValueRequired = isJokeApiEndpoint && param.name === 'value' && ['joke', 'category', 'categories', 'filter'].includes(selectedJokeApiType);

    // Context-awareness for Official Joke API
    const isOfficialJokeEndpoint = endpoint.id === 'official-joke';
    const selectedOfficialJokeType = queryParams.type || 'random';
    const isOfficialJokeValueRequired =
      isOfficialJokeEndpoint &&
      param.name === 'value' &&
      ['randomMultiple', 'byType', 'joke'].includes(selectedOfficialJokeType);

    const isRequired =
      (param.required && !isAllSelectedInCountries) ||
      isBreedRequiredForDogs ||
      isJikanValueRequired ||
      isCoingeckoValueRequired ||
      isGithubUsernameRequired ||
      isGithubOwnerRequired ||
      isGithubRepoRequired ||
      isGithubQueryRequired ||
      isOpenLibraryValueRequired ||
      isGutendexValueRequired ||
      isOpenFoodFactsValueRequired ||
      isMealDbValueRequired ||
      isCocktailDbValueRequired ||
      isJokeApiValueRequired ||
      isOfficialJokeValueRequired;

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
    } else if (isGithubUsernameRequired) {
      customPlaceholder = 'e.g. octocat (Required username)';
    } else if (isGithubOwnerRequired) {
      customPlaceholder = 'e.g. octocat (Required owner)';
    } else if (isGithubRepoRequired) {
      customPlaceholder = 'e.g. Hello-World (Required repository)';
    } else if (isGithubQueryRequired) {
      customPlaceholder = 'e.g. javascript (Required search query)';
    } else if (isGithubEndpoint && param.name === 'state' && selectedGithubType === 'repoIssues') {
      customPlaceholder = 'e.g. open (Optional state: open, closed, all)';
    } else if (isOpenLibraryValueRequired) {
      customPlaceholder =
        selectedOpenLibraryType === 'work' ? 'e.g. OL45804W (Work ID)' :
        selectedOpenLibraryType === 'edition' ? 'e.g. OL7353617M (Edition ID)' :
        selectedOpenLibraryType === 'author' ? 'e.g. OL23919A (Author ID)' :
        selectedOpenLibraryType === 'subject' ? 'e.g. science_fiction (Subject)' :
        'e.g. 9780140328721 (ISBN-10 or ISBN-13)';
    } else if (isOpenLibraryEndpoint && param.name === 'q') {
      customPlaceholder = 'e.g. pride and prejudice (Optional search query)';
    } else if (isOpenLibraryEndpoint && param.name === 'title') {
      customPlaceholder = 'e.g. pride and prejudice (Optional title filter)';
    } else if (isGutendexValueRequired) {
      customPlaceholder = 'e.g. 11 (Required Gutenberg Book ID)';
    } else if (isGutendexEndpoint && param.name === 'search') {
      customPlaceholder = 'e.g. frankenstein (Optional search query)';
    } else if (isOpenFoodFactsValueRequired) {
      customPlaceholder =
        selectedOpenFoodFactsType === 'product' ? 'e.g. 737628064502 (Product Barcode)' :
        selectedOpenFoodFactsType === 'category' ? 'e.g. beverages (Category Identifier)' :
        selectedOpenFoodFactsType === 'brand' ? 'e.g. nestle (Brand Identifier)' :
        selectedOpenFoodFactsType === 'ingredient' ? 'e.g. en:sugar (Ingredient Identifier)' :
        selectedOpenFoodFactsType === 'additive' ? 'e.g. en:e330 (Additive Identifier)' :
        selectedOpenFoodFactsType === 'allergen' ? 'e.g. en:peanuts (Allergen Identifier)' :
        selectedOpenFoodFactsType === 'label' ? 'e.g. en:organic (Label Identifier)' :
        'e.g. en:plastic (Packaging Material Identifier)';
    } else if (isOpenFoodFactsEndpoint && param.name === 'categories_tags_en') {
      customPlaceholder = 'e.g. beverages (Category filter for products)';
    } else if (isOpenFoodFactsEndpoint && param.name === 'search_terms') {
      customPlaceholder = 'e.g. milk (Optional product search query)';
    } else if (isMealDbEndpoint && param.name === 'value') {
      customPlaceholder = selectedMealDbType === 'lookup' ? 'e.g. 52772 (Required Meal ID)' : 'e.g. Arrabiata (Required Meal Name)';
    } else if (isMealDbEndpoint && param.name === 'category') {
      customPlaceholder = 'e.g. Seafood, Beef, Vegetarian';
    } else if (isMealDbEndpoint && param.name === 'area') {
      customPlaceholder = 'e.g. Indian, Italian, Mexican';
    } else if (isMealDbEndpoint && param.name === 'ingredient') {
      customPlaceholder = 'e.g. Chicken, Salmon, Garlic';
    } else if (isCocktailDbEndpoint && param.name === 'value') {
      customPlaceholder = selectedCocktailDbType === 'lookup' ? '11007' : 'margarita';
    } else if (isCocktailDbEndpoint && param.name === 'ingredient') {
      customPlaceholder = 'e.g. Gin, Vodka, Tequila';
    } else if (isCocktailDbEndpoint && param.name === 'category') {
      customPlaceholder = 'e.g. Cocktail, Ordinary Drink, Shot';
    } else if (isCocktailDbEndpoint && param.name === 'alcoholic') {
      customPlaceholder = 'e.g. Alcoholic, Non_Alcoholic';
    } else if (isCocktailDbEndpoint && param.name === 'glass') {
      customPlaceholder = 'e.g. Cocktail_glass, Highball_glass';
    } else if (isJokeApiEndpoint && param.name === 'value') {
      customPlaceholder = selectedJokeApiType === 'joke'
        ? '123'
        : selectedJokeApiType === 'categories'
        ? 'Programming,Misc'
        : 'Programming';
    } else if (isJokeApiEndpoint && param.name === 'blacklistFlags') {
      customPlaceholder = 'nsfw,religious,political';
    } else if (isJokeApiEndpoint && param.name === 'amount') {
      customPlaceholder = '5';
    } else if (isJokeApiEndpoint && param.name === 'lang') {
      customPlaceholder = 'en';
    } else if (isOfficialJokeEndpoint && param.name === 'value') {
      customPlaceholder = selectedOfficialJokeType === 'randomMultiple'
        ? 'e.g. 5 (Count)'
        : selectedOfficialJokeType === 'byType'
        ? 'e.g. programming'
        : selectedOfficialJokeType === 'joke'
        ? 'e.g. 1'
        : 'Value';
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
            {!param.required && endpoint.id !== 'github' && endpoint.id !== 'open-library' && endpoint.id !== 'gutendex' && endpoint.id !== 'open-food-facts' && endpoint.id !== 'meal-db' && endpoint.id !== 'cocktail-db' && endpoint.id !== 'joke-api' && endpoint.id !== 'official-joke' && <option value="">(Default)</option>}
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
            : isGithubUsernameRequired
            ? `Required: GitHub username for operation "${selectedGithubType}"`
            : isGithubOwnerRequired
            ? `Required: Repository owner for operation "${selectedGithubType}"`
            : isGithubRepoRequired
            ? `Required: Repository name for operation "${selectedGithubType}"`
            : isGithubQueryRequired
            ? `Required: Search keyword query for operation "${selectedGithubType}"`
            : isGithubEndpoint && param.name === 'state'
            ? 'Optional issue state filter (open, closed, all)'
            : isOpenLibraryValueRequired
            ? `Required: Identifier for operation "${selectedOpenLibraryType}"`
            : isOpenLibraryEndpoint && param.name === 'q'
            ? 'Optional query keyword to search works and editions'
            : isOpenLibraryEndpoint && param.name === 'title'
            ? 'Optional title filter for book search'
            : isGutendexValueRequired
            ? `Required: Gutenberg book ID for operation "${selectedGutendexType}"`
            : isGutendexEndpoint && param.name === 'search'
            ? 'Optional search term to filter Project Gutenberg catalog'
            : isOpenFoodFactsValueRequired
            ? `Required: Identifier for operation "${selectedOpenFoodFactsType}"`
            : isOpenFoodFactsEndpoint && param.name === 'categories_tags_en'
            ? 'Optional category tag to filter products (e.g. beverages, snacks)'
            : isOpenFoodFactsEndpoint && param.name === 'search_terms'
            ? 'Optional search keyword to filter products catalog'
            : isMealDbValueRequired
            ? `Required: ${selectedMealDbType === 'lookup' ? 'Meal ID' : 'Meal Name'} for operation "${selectedMealDbType}"`
            : isMealDbEndpoint && param.name === 'category'
            ? 'Filter meals by category (e.g. Seafood, Beef)'
            : isMealDbEndpoint && param.name === 'area'
            ? 'Filter meals by area / cuisine (e.g. Indian, Italian)'
            : isMealDbEndpoint && param.name === 'ingredient'
            ? 'Filter meals by main ingredient (e.g. Chicken, Salmon)'
            : isCocktailDbValueRequired
            ? `Required: ${selectedCocktailDbType === 'lookup' ? 'Cocktail ID' : 'Cocktail Name'} for operation "${selectedCocktailDbType}"`
            : isCocktailDbEndpoint && param.name === 'ingredient'
            ? 'Filter cocktails by ingredient (e.g. Gin, Vodka)'
            : isCocktailDbEndpoint && param.name === 'category'
            ? 'Filter cocktails by category (e.g. Cocktail, Shot)'
            : isCocktailDbEndpoint && param.name === 'alcoholic'
            ? 'Filter cocktails by alcoholic classification (e.g. Alcoholic, Non_Alcoholic)'
            : isCocktailDbEndpoint && param.name === 'glass'
            ? 'Filter cocktails by glass type (e.g. Cocktail_glass, Highball_glass)'
            : isJokeApiValueRequired
            ? `Required: ${selectedJokeApiType === 'joke' ? 'Joke ID' : selectedJokeApiType === 'categories' ? 'Categories' : 'Category'} for operation "${selectedJokeApiType}"`
            : isJokeApiEndpoint && param.name === 'blacklistFlags'
            ? 'Comma-separated flags to exclude (e.g. nsfw,religious,political)'
            : isJokeApiEndpoint && param.name === 'safe'
            ? 'Safe for Work filter (safe=true excludes sensitive jokes)'
            : isJokeApiEndpoint && param.name === 'format'
            ? 'Joke format: single (one-liner) or twopart (setup & delivery)'
            : isJokeApiEndpoint && param.name === 'amount'
            ? 'Number of jokes to return (e.g. 5)'
            : isJokeApiEndpoint && param.name === 'lang'
            ? 'Language code (e.g. en, de, es, fr)'
            : isOfficialJokeValueRequired
            ? `Required: ${selectedOfficialJokeType === 'randomMultiple' ? 'Positive integer count' : selectedOfficialJokeType === 'byType' ? 'Joke type (e.g. programming)' : 'Joke ID (e.g. 1)'} for operation "${selectedOfficialJokeType}"`
            : isOfficialJokeEndpoint && param.name === 'mode'
            ? 'Mode for byType: random (single joke) or ten (10 jokes)'
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
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Interactive Playground</h2>
            {endpoint.badge && (
              <span className="flex items-center space-x-1 px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 rounded-md">
                <Lock size={10} />
                <span>{endpoint.badge.text}</span>
              </span>
            )}
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

      {/* Deployment & Reliability Notice (e.g. Gutendex Vercel warning) */}
      {endpoint.warningNotice && (
        <div className="p-3.5 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 dark:border-amber-500/40 rounded-xl flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
          <Lock className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={16} />
          <div className="space-y-1">
            <div className="font-semibold text-amber-950 dark:text-amber-100 flex items-center space-x-1.5">
              <span>Working On / Vercel Deployment Notice</span>
            </div>
            <p className="leading-relaxed text-amber-800 dark:text-amber-300">
              {endpoint.warningNotice}
            </p>
          </div>
        </div>
      )}

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
                ) : endpoint.id === 'github' ? (
                  <div className="space-y-4">
                    {/* 1. Operation Selection (Type) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          GitHub Operation
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">17 supported operations</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {endpoint.queryParams
                          .filter(p => p.name === 'type')
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 2. Operation-Specific Conditional Parameters */}
                    {(() => {
                      const selectedType = queryParams.type || 'users';
                      const isUserOp = ['user', 'userRepos'].includes(selectedType);
                      const isRepoOp = [
                        'repos', 'repoIssues', 'repoPulls', 'repoCommits', 'repoBranches',
                        'repoReleases', 'repoTags', 'repoLanguages', 'repoContributors', 'repoContents'
                      ].includes(selectedType);
                      const isSearchOp = ['searchRepositories', 'searchUsers', 'searchIssues', 'searchCommits'].includes(selectedType);

                      if (selectedType === 'users') {
                        return (
                          <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                            <span>Default operation: Lists public GitHub users. No additional parameters required.</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-500/20">
                              GET /github
                            </span>
                          </div>
                        );
                      }

                      if (isUserOp) {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                User Parameters
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">for type={selectedType}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'username')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (isRepoOp) {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Repository Parameters
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">for type={selectedType}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {endpoint.queryParams
                                .filter(p => ['owner', 'repo'].includes(p.name))
                                .map(renderQueryParamInput)}
                            </div>
                            {selectedType === 'repoIssues' && (
                              <div className="pt-2">
                                {endpoint.queryParams
                                  .filter(p => p.name === 'state')
                                  .map(renderQueryParamInput)}
                              </div>
                            )}
                          </div>
                        );
                      }

                      if (isSearchOp) {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Search Parameters
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">for type={selectedType}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'q')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>
                ) : endpoint.id === 'open-library' ? (
                  <div className="space-y-4">
                    {/* 1. Operation Selection (Type) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Open Library Operation
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">6 supported operations</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {endpoint.queryParams
                          .filter(p => p.name === 'type')
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 2. Operation-Specific Dynamic Inputs */}
                    {(() => {
                      const selectedType = queryParams.type || 'search';
                      const isSearchOp = selectedType === 'search';
                      const isIdOp = ['work', 'edition', 'author', 'subject', 'isbn'].includes(selectedType);

                      if (isSearchOp) {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Search Parameters
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">optional catalog query</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {endpoint.queryParams
                                .filter(p => ['q', 'title'].includes(p.name))
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (isIdOp) {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                {selectedType === 'work' ? 'Work Identifier' :
                                 selectedType === 'edition' ? 'Edition Identifier' :
                                 selectedType === 'author' ? 'Author Identifier' :
                                 selectedType === 'subject' ? 'Subject Identifier' :
                                 'ISBN'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">for type={selectedType}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'value')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>
                ) : endpoint.id === 'gutendex' ? (
                  <div className="space-y-4">
                    {/* 1. Operation Selection (Type) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Gutendex Operation
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">2 supported operations</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {endpoint.queryParams
                          .filter(p => p.name === 'type')
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 2. Operation-Specific Dynamic Inputs */}
                    {(() => {
                      const selectedType = queryParams.type || 'books';

                      if (selectedType === 'books') {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Books Catalog Search
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">optional search filter</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'search')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (selectedType === 'book') {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Book Identifier
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">required for type=book</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'value')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>
                ) : endpoint.id === 'open-food-facts' ? (
                  <div className="space-y-4">
                    {/* 1. Operation Selection (Type) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Open Food Facts Operation
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">16 supported operations</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {endpoint.queryParams
                          .filter(p => p.name === 'type')
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 2. Operation-Specific Dynamic Inputs */}
                    {(() => {
                      const selectedType = queryParams.type || 'product';
                      const isProductsOp = selectedType === 'products';
                      const isIdOp = [
                        'product', 'category', 'brand', 'ingredient', 'additive',
                        'allergen', 'label', 'packagingMaterial'
                      ].includes(selectedType);
                      const isListOp = [
                        'categories', 'brands', 'countries', 'ingredients', 'additives',
                        'allergens', 'labels', 'packaging'
                      ].includes(selectedType);

                      if (isProductsOp) {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Product Search & Filter Parameters
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">optional category and search filters</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'categories_tags_en' || p.name === 'search_terms')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (isIdOp) {
                        const idLabel =
                          selectedType === 'product' ? 'Product Barcode' :
                          selectedType === 'category' ? 'Category Identifier' :
                          selectedType === 'brand' ? 'Brand Identifier' :
                          selectedType === 'ingredient' ? 'Ingredient Identifier' :
                          selectedType === 'additive' ? 'Additive Identifier' :
                          selectedType === 'allergen' ? 'Allergen Identifier' :
                          selectedType === 'label' ? 'Label Identifier' :
                          'Packaging Material Identifier';

                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                {idLabel}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">required for type={selectedType}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'value')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (isListOp) {
                        const listDescriptions: Record<string, string> = {
                          categories: 'List known product categories',
                          brands: 'List brands',
                          countries: 'List countries',
                          ingredients: 'List ingredients',
                          additives: 'List additives',
                          allergens: 'List allergens',
                          labels: 'List labels',
                          packaging: 'List packaging entries'
                        };

                        return (
                          <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                            <span>{listDescriptions[selectedType] || 'List entries'}. No additional parameters required.</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-500/20">
                              GET /open-food-facts?type={selectedType}
                            </span>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>
                ) : endpoint.id === 'meal-db' ? (
                  <div className="space-y-4">
                    {/* 1. Operation Selection (Type) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          1. Select Operation
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">defaults to random (GET /meal-db)</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {endpoint.queryParams
                          .filter(p => p.name === 'type')
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 2. Contextual Parameters based on Operation */}
                    {(() => {
                      const selectedType = queryParams.type || 'random';

                      if (selectedType === 'random') {
                        return (
                          <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                            <span>Get a random meal. No additional parameters required.</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-500/20">
                              GET /meal-db
                            </span>
                          </div>
                        );
                      }

                      if (selectedType === 'randomSelection') {
                        return (
                          <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                            <span>Get a random selection of meals. No additional parameters required.</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-500/20">
                              GET /meal-db?type=randomSelection
                            </span>
                          </div>
                        );
                      }

                      if (selectedType === 'lookup') {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Meal Identifier
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">required for type=lookup</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'value')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (selectedType === 'search') {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Meal Search Query
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">required for type=search</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'value')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (selectedType === 'filter') {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Filter Parameters
                              </span>
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Provide at least one filter</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'category' || p.name === 'area' || p.name === 'ingredient')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (['categories', 'areas', 'ingredients'].includes(selectedType)) {
                        const labels: Record<string, string> = {
                          categories: 'List meal categories',
                          areas: 'List meal areas / cuisines',
                          ingredients: 'List meal ingredients'
                        };

                        return (
                          <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                            <span>{labels[selectedType]}. No additional parameters required.</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-500/20">
                              GET /meal-db?type={selectedType}
                            </span>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>
                ) : endpoint.id === 'cocktail-db' ? (
                  <div className="space-y-4">
                    {/* 1. Operation Selection (Type) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          1. Select Operation
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">defaults to random (GET /cocktail-db)</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {endpoint.queryParams
                          .filter(p => p.name === 'type')
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 2. Contextual Parameters based on Operation */}
                    {(() => {
                      const selectedType = queryParams.type || 'random';

                      if (selectedType === 'random') {
                        return (
                          <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                            <span>Get a random cocktail. No additional parameters required.</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-500/20">
                              GET /cocktail-db
                            </span>
                          </div>
                        );
                      }

                      if (selectedType === 'randomMultiple') {
                        return (
                          <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                            <span>Get a random selection of cocktails. No additional parameters required.</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-500/20">
                              GET /cocktail-db?type=randomMultiple
                            </span>
                          </div>
                        );
                      }

                      if (selectedType === 'lookup') {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Cocktail ID
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">required for type=lookup</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'value')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (selectedType === 'search') {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Cocktail Name
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">required for type=search</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'value')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (selectedType === 'filter') {
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Filter Parameters
                              </span>
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Provide at least one filter</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'ingredient' || p.name === 'category' || p.name === 'alcoholic' || p.name === 'glass')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (['categories', 'glass', 'ingredients', 'alcoholic'].includes(selectedType)) {
                        const labels: Record<string, string> = {
                          categories: 'List cocktail categories',
                          glass: 'List glass types',
                          ingredients: 'List cocktail ingredients',
                          alcoholic: 'List alcoholic classifications'
                        };

                        return (
                          <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                            <span>{labels[selectedType]}. No additional parameters required.</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-500/20">
                              GET /cocktail-db?type={selectedType}
                            </span>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>
                ) : endpoint.id === 'joke-api' ? (
                  <div className="space-y-4">
                    {/* 1. Operation Selection (Type) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          1. Select Operation
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">defaults to random (GET /joke-api)</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {endpoint.queryParams
                          .filter(p => p.name === 'type')
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 2. Contextual Parameters based on Operation */}
                    {(() => {
                      const selectedType = queryParams.type || 'random';

                      return (
                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                          {selectedType === 'random' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {endpoint.queryParams
                                  .filter(p => p.name === 'value' || p.name === 'amount')
                                  .map(renderQueryParamInput)}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {endpoint.queryParams
                                  .filter(p => p.name === 'format' || p.name === 'safe' || p.name === 'lang')
                                  .map(renderQueryParamInput)}
                              </div>
                            </div>
                          )}

                          {selectedType === 'joke' && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                  Joke ID
                                </span>
                                <span className="text-[10px] text-rose-500 font-mono">required (e.g. 123)</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {endpoint.queryParams
                                  .filter(p => p.name === 'value' || p.name === 'lang')
                                  .map(renderQueryParamInput)}
                              </div>
                            </div>
                          )}

                          {selectedType === 'category' && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                  Category Name
                                </span>
                                <span className="text-[10px] text-rose-500 font-mono">required (e.g. Programming)</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {endpoint.queryParams
                                  .filter(p => p.name === 'value' || p.name === 'amount')
                                  .map(renderQueryParamInput)}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {endpoint.queryParams
                                  .filter(p => p.name === 'format' || p.name === 'safe' || p.name === 'lang')
                                  .map(renderQueryParamInput)}
                              </div>
                            </div>
                          )}

                          {selectedType === 'categories' && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                  Multiple Categories
                                </span>
                                <span className="text-[10px] text-rose-500 font-mono">required (e.g. Programming,Misc)</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {endpoint.queryParams
                                  .filter(p => p.name === 'value' || p.name === 'amount')
                                  .map(renderQueryParamInput)}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {endpoint.queryParams
                                  .filter(p => p.name === 'format' || p.name === 'safe' || p.name === 'lang')
                                  .map(renderQueryParamInput)}
                              </div>
                            </div>
                          )}

                          {selectedType === 'filter' && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                  Filter Criteria
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">value (category) required</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {endpoint.queryParams
                                  .filter(p => p.name === 'value' || p.name === 'blacklistFlags')
                                  .map(renderQueryParamInput)}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                {endpoint.queryParams
                                  .filter(p => p.name === 'amount' || p.name === 'format' || p.name === 'safe' || p.name === 'lang')
                                  .map(renderQueryParamInput)}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ) : endpoint.id === 'official-joke' ? (
                  <div className="space-y-4">
                    {/* 1. Operation Selection (Type) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          1. Select Operation
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">defaults to random (GET /official-joke)</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {endpoint.queryParams
                          .filter(p => p.name === 'type')
                          .map(renderQueryParamInput)}
                      </div>
                    </div>

                    {/* 2. Contextual Parameters based on Operation */}
                    {(() => {
                      const selectedType = queryParams.type || 'random';

                      if (['random', 'randomTen', 'ten', 'types'].includes(selectedType)) {
                        const labels: Record<string, string> = {
                          random: 'Random Joke (default)',
                          randomTen: 'Ten Random Jokes',
                          ten: 'Ten Jokes',
                          types: 'Joke Types'
                        };
                        const urlSuffix = selectedType === 'random' ? '' : `?type=${selectedType}`;
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                              <span>{labels[selectedType]}. No additional parameters required.</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-500/20">
                                GET /official-joke{urlSuffix}
                              </span>
                            </div>
                          </div>
                        );
                      }

                      if (selectedType === 'randomMultiple') {
                        return (
                          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Count (Positive Integer)
                              </span>
                              <span className="text-[10px] text-rose-500 font-mono">required (e.g. 5)</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'value')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (selectedType === 'byType') {
                        return (
                          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Joke Type & Mode
                              </span>
                              <span className="text-[10px] text-rose-500 font-mono">type required (e.g. programming)</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'value' || p.name === 'mode')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      if (selectedType === 'joke') {
                        return (
                          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Joke ID
                              </span>
                              <span className="text-[10px] text-rose-500 font-mono">required (e.g. 1)</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {endpoint.queryParams
                                .filter(p => p.name === 'value')
                                .map(renderQueryParamInput)}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })()}
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
