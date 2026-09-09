import { EndpointDefinition, StatusCodeDoc } from '../types/api';

export const COMMON_STATUS_CODES: StatusCodeDoc[] = [
  {
    code: 200,
    title: 'Success',
    description: 'The request succeeded and the requested resource or collection was returned.',
    responseExample: {
      success: true,
      statusCode: 200,
      data: { /* resource or array */ }
    }
  },
  {
    code: 400,
    title: 'Bad Request',
    description: 'Invalid request parameters, missing required fields, or unrecognized resource types.',
    responseExample: {
      success: false,
      statusCode: 400,
      status: false,
      message: 'latitude is required'
    }
  },
  {
    code: 404,
    title: 'Not Found',
    description: 'The requested resource, endpoint path, or specific identifier does not exist.',
    responseExample: {
      success: false,
      statusCode: 404,
      status: false,
      message: 'Resource not found'
    }
  },
  {
    code: 408,
    title: 'Request Timeout',
    description: 'The upstream provider did not respond within the allocated timeframe.',
    responseExample: {
      success: false,
      statusCode: 408,
      status: false,
      message: 'Upstream request timed out'
    }
  },
  {
    code: 500,
    title: 'Internal Server Error',
    description: 'An unhandled exception or parsing error occurred on the API server.',
    responseExample: {
      success: false,
      statusCode: 500,
      status: false,
      message: 'Internal server error'
    }
  },
  {
    code: 502,
    title: 'Bad Gateway',
    description: 'Failed to communicate with or receive a valid payload from the upstream data provider.',
    responseExample: {
      success: false,
      statusCode: 502,
      status: false,
      message: 'Failed to communicate with upstream API'
    }
  }
];

export const API_ENDPOINTS: EndpointDefinition[] = [
  // 1. Health Check
  {
    id: 'health-check',
    category: 'health',
    categoryTitle: 'Health Check',
    method: 'GET',
    path: '/',
    title: 'Server Health Check',
    shortDescription: 'Verifies that the API server is online and operational.',
    description: 'Performs a lightweight ping against the root endpoint to check server availability, uptime, and operational health.',
    notes: [
      'Returns immediately with a 200 OK status code when the server is healthy.',
      'Can be used by uptime monitors, load balancers, and container health probes.'
    ],
    pathParams: [],
    queryParams: [],
    presets: [
      {
        id: 'default-ping',
        label: 'Ping Health Check',
        description: 'Verify server is reachable and responsive'
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/',
    exampleCurl: 'curl -X GET "https://free-api-server.vercel.app/"',
    responseExample: {
      success: true,
      message: "API is working",
      timestamp: 1726000000000
    },
    statusCodes: [COMMON_STATUS_CODES[0], COMMON_STATUS_CODES[4]]
  },

  // 2. Fake API - Collection
  {
    id: 'fake-collection',
    category: 'fake',
    categoryTitle: 'Fake API',
    method: 'GET',
    path: '/fake/:type',
    title: 'Fake API Collection',
    shortDescription: 'Retrieve a list of placeholder resources by type (users, posts, comments, etc.).',
    description: 'Returns a full array of fake mock resources. Powered by standard placeholder fixtures perfect for prototyping UI tables, feeds, card grids, and user lists.',
    notes: [
      'Supported resource types: users, posts, comments, albums, todos, photos.',
      'Optional query parameters can be passed to filter items (e.g. ?userId=1 on posts).'
    ],
    pathParams: [
      {
        name: 'type',
        label: 'Resource Type',
        type: 'enum',
        required: true,
        description: 'The category of placeholder resource to retrieve.',
        defaultValue: 'users',
        options: [
          { label: 'Users', value: 'users', description: 'User profiles with names, emails, addresses, and companies' },
          { label: 'Posts', value: 'posts', description: 'Blog articles with titles and body content' },
          { label: 'Comments', value: 'comments', description: 'User comments on posts' },
          { label: 'Albums', value: 'albums', description: 'Photo album collections' },
          { label: 'Todos', value: 'todos', description: 'Task items with completion status' },
          { label: 'Photos', value: 'photos', description: 'Image metadata and thumbnail URLs' }
        ]
      }
    ],
    queryParams: [
      {
        name: 'userId',
        label: 'User ID Filter',
        type: 'number',
        required: false,
        description: 'Filter posts, albums, or todos by associated userId.',
        placeholder: 'e.g. 1'
      }
    ],
    presets: [
      {
        id: 'get-users',
        label: 'Get All Users',
        description: 'Fetch complete list of mock users',
        pathParams: { type: 'users' }
      },
      {
        id: 'get-posts',
        label: 'Get All Posts',
        description: 'Fetch complete list of articles',
        pathParams: { type: 'posts' }
      },
      {
        id: 'get-user-posts',
        label: 'Get Posts by User #1',
        description: 'Filter posts by userId=1',
        pathParams: { type: 'posts' },
        queryParams: { userId: '1' }
      },
      {
        id: 'get-todos',
        label: 'Get Todos',
        description: 'Fetch task list items',
        pathParams: { type: 'todos' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/fake/users',
    exampleCurl: 'curl -X GET "https://free-api-server.vercel.app/fake/users"',
    responseExample: [
      {
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz",
        address: {
          street: "Kulas Light",
          suite: "Apt. 556",
          city: "Gwenborough",
          zipcode: "92998-3874",
          geo: { lat: "-37.3159", lng: "81.1496" }
        },
        phone: "1-770-736-8031 x56442",
        website: "hildegard.org",
        company: {
          name: "Romaguera-Crona",
          catchPhrase: "Multi-layered client-server neural-net",
          bs: "harness real-time e-markets"
        }
      }
    ],
    statusCodes: [COMMON_STATUS_CODES[0], COMMON_STATUS_CODES[1], COMMON_STATUS_CODES[2]]
  },

  // 3. Fake API - Resource by ID
  {
    id: 'fake-resource-by-id',
    category: 'fake',
    categoryTitle: 'Fake API',
    method: 'GET',
    path: '/fake/:type/:id',
    title: 'Fake API Resource by ID',
    shortDescription: 'Retrieve a single fake resource by its unique identifier.',
    description: 'Fetches the full individual record for a specific resource type and numeric identifier.',
    notes: [
      'If the resource ID does not exist in the collection, the API will return a 404 status code.'
    ],
    pathParams: [
      {
        name: 'type',
        label: 'Resource Type',
        type: 'enum',
        required: true,
        description: 'The category of placeholder resource.',
        defaultValue: 'users',
        options: [
          { label: 'Users', value: 'users', description: 'User profile' },
          { label: 'Posts', value: 'posts', description: 'Blog post' },
          { label: 'Comments', value: 'comments', description: 'Comment record' },
          { label: 'Albums', value: 'albums', description: 'Album record' },
          { label: 'Todos', value: 'todos', description: 'Todo item' },
          { label: 'Photos', value: 'photos', description: 'Photo metadata' }
        ]
      },
      {
        name: 'id',
        label: 'Resource ID',
        type: 'number',
        required: true,
        description: 'The unique numeric ID of the resource.',
        defaultValue: '1',
        placeholder: 'e.g. 1'
      }
    ],
    queryParams: [],
    presets: [
      {
        id: 'user-1',
        label: 'User #1',
        description: 'Fetch profile for Leanne Graham',
        pathParams: { type: 'users', id: '1' }
      },
      {
        id: 'post-1',
        label: 'Post #1',
        description: 'Fetch post with ID 1',
        pathParams: { type: 'posts', id: '1' }
      },
      {
        id: 'todo-1',
        label: 'Todo #1',
        description: 'Fetch first todo item',
        pathParams: { type: 'todos', id: '1' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/fake/users/1',
    exampleCurl: 'curl -X GET "https://free-api-server.vercel.app/fake/users/1"',
    responseExample: {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz",
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org"
    },
    statusCodes: [COMMON_STATUS_CODES[0], COMMON_STATUS_CODES[1], COMMON_STATUS_CODES[2]]
  },

  // 4. Fake API - Nested Resource
  {
    id: 'fake-nested-resource',
    category: 'fake',
    categoryTitle: 'Fake API',
    method: 'GET',
    path: '/fake/:type/:id/:subtype',
    title: 'Nested Fake API Resource',
    shortDescription: 'Fetch nested sub-resources associated with a parent item.',
    description: 'Retrieves child collections belonging to a parent item, such as all comments attached to a specific post, or all todos belonging to a specific user.',
    notes: [
      'Common combinations: /fake/posts/1/comments, /fake/users/1/todos, /fake/users/1/albums, /fake/albums/1/photos'
    ],
    pathParams: [
      {
        name: 'type',
        label: 'Parent Resource Type',
        type: 'enum',
        required: true,
        description: 'Parent entity type.',
        defaultValue: 'posts',
        options: [
          { label: 'Posts', value: 'posts' },
          { label: 'Users', value: 'users' },
          { label: 'Albums', value: 'albums' }
        ]
      },
      {
        name: 'id',
        label: 'Parent ID',
        type: 'number',
        required: true,
        description: 'Parent resource ID.',
        defaultValue: '1',
        placeholder: 'e.g. 1'
      },
      {
        name: 'subtype',
        label: 'Sub-Resource Type',
        type: 'enum',
        required: true,
        description: 'Child resource collection to fetch.',
        defaultValue: 'comments',
        options: [
          { label: 'Comments', value: 'comments', description: 'Comments belonging to a post' },
          { label: 'Todos', value: 'todos', description: 'Todos belonging to a user' },
          { label: 'Albums', value: 'albums', description: 'Albums belonging to a user' },
          { label: 'Photos', value: 'photos', description: 'Photos belonging to an album' }
        ]
      }
    ],
    queryParams: [],
    presets: [
      {
        id: 'post-1-comments',
        label: 'Post #1 Comments',
        description: 'Get all comments on post 1',
        pathParams: { type: 'posts', id: '1', subtype: 'comments' }
      },
      {
        id: 'user-1-todos',
        label: 'User #1 Todos',
        description: 'Get all todos assigned to user 1',
        pathParams: { type: 'users', id: '1', subtype: 'todos' }
      },
      {
        id: 'user-1-albums',
        label: 'User #1 Albums',
        description: 'Get all albums created by user 1',
        pathParams: { type: 'users', id: '1', subtype: 'albums' }
      },
      {
        id: 'album-1-photos',
        label: 'Album #1 Photos',
        description: 'Get photos in album 1',
        pathParams: { type: 'albums', id: '1', subtype: 'photos' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/fake/posts/1/comments',
    exampleCurl: 'curl -X GET "https://free-api-server.vercel.app/fake/posts/1/comments"',
    responseExample: [
      {
        postId: 1,
        id: 1,
        name: "id labore ex et quam laborum",
        email: "Eliseo@gardner.biz",
        body: "laudantium enim quasi est quidem magnam voluptate ipsam eos..."
      }
    ],
    statusCodes: [COMMON_STATUS_CODES[0], COMMON_STATUS_CODES[1], COMMON_STATUS_CODES[2]]
  },

  // 5. Mock API - Collection
  {
    id: 'mock-collection',
    category: 'mock',
    categoryTitle: 'Mock API',
    method: 'GET',
    path: '/mock/:type',
    title: 'Mock API Collection',
    shortDescription: 'Advanced mock database with pagination, field projection, sorting, and rich schemas.',
    description: 'Access rich e-commerce, recipe, quote, and system datasets with full support for limit, skip, field projection (select), and multi-direction sorting.',
    notes: [
      'Supported resource types: products, carts, users, posts, comments, quotes, todos, recipes, ip, image.',
      'Supports limit and skip for client-side pagination.',
      'Supports select to restrict payload to specific keys (e.g. select=title,price).',
      'Supports sortBy and order (asc/desc) for ordering collections.'
    ],
    pathParams: [
      {
        name: 'type',
        label: 'Mock Resource Type',
        type: 'enum',
        required: true,
        description: 'The dataset type to query.',
        defaultValue: 'products',
        options: [
          { label: 'Products', value: 'products', description: 'E-commerce items with prices, categories, ratings, stock' },
          { label: 'Carts', value: 'carts', description: 'Shopping cart orders and line items' },
          { label: 'Users', value: 'users', description: 'User accounts with age, gender, crypto, company data' },
          { label: 'Posts', value: 'posts', description: 'Articles with tags and reactions count' },
          { label: 'Comments', value: 'comments', description: 'Discussions with user references' },
          { label: 'Quotes', value: 'quotes', description: 'Famous quotes and authors' },
          { label: 'Todos', value: 'todos', description: 'Tasks and completion flags' },
          { label: 'Recipes', value: 'recipes', description: 'Food recipes with ingredients, prep time, instructions' },
          { label: 'IP', value: 'ip', description: 'Client IP lookup address' },
          { label: 'Image', value: 'image', description: 'Random placeholder image generator' }
        ]
      }
    ],
    queryParams: [
      {
        name: 'limit',
        label: 'Limit (Items per page)',
        type: 'number',
        required: false,
        description: 'Maximum number of items to return in the response.',
        placeholder: 'e.g. 10',
        defaultValue: '10'
      },
      {
        name: 'skip',
        label: 'Skip (Offset)',
        type: 'number',
        required: false,
        description: 'Number of initial items to skip for pagination.',
        placeholder: 'e.g. 0'
      },
      {
        name: 'select',
        label: 'Select (Field Projection)',
        type: 'string',
        required: false,
        description: 'Comma-separated list of fields to include in each item.',
        placeholder: 'e.g. title,price,category',
        example: 'title,price'
      },
      {
        name: 'sortBy',
        label: 'Sort By Field',
        type: 'string',
        required: false,
        description: 'Property name to sort the collection by.',
        placeholder: 'e.g. price or title'
      },
      {
        name: 'order',
        label: 'Sort Order',
        type: 'enum',
        required: false,
        description: 'Sorting direction.',
        options: [
          { label: 'Ascending (asc)', value: 'asc' },
          { label: 'Descending (desc)', value: 'desc' }
        ]
      }
    ],
    presets: [
      {
        id: 'products-limit-10',
        label: '10 Products',
        description: 'Fetch first 10 products',
        pathParams: { type: 'products' },
        queryParams: { limit: '10' }
      },
      {
        id: 'products-skip-10',
        label: 'Page 2 Products (Skip 10)',
        description: 'Pagination with skip=10 and limit=10',
        pathParams: { type: 'products' },
        queryParams: { skip: '10', limit: '10' }
      },
      {
        id: 'products-projection',
        label: 'Project Fields (title, price)',
        description: 'Select only title and price properties',
        pathParams: { type: 'products' },
        queryParams: { limit: '5', select: 'title,price' }
      },
      {
        id: 'products-sorted-price',
        label: 'Sort by Price ASC',
        description: 'Cheapest products first',
        pathParams: { type: 'products' },
        queryParams: { limit: '5', sortBy: 'price', order: 'asc' }
      },
      {
        id: 'mock-quotes-5',
        label: '5 Famous Quotes',
        description: 'Inspirational quotes dataset',
        pathParams: { type: 'quotes' },
        queryParams: { limit: '5' }
      },
      {
        id: 'mock-recipes-top',
        label: 'Top Recipes',
        description: 'Recipes dataset',
        pathParams: { type: 'recipes' },
        queryParams: { limit: '3' }
      },
      {
        id: 'mock-ip-lookup',
        label: 'Current IP Address',
        description: 'Inspect client request IP',
        pathParams: { type: 'ip' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/mock/products?limit=10',
    exampleCurl: 'curl -X GET "https://free-api-server.vercel.app/mock/products?limit=10"',
    responseExample: {
      products: [
        {
          id: 1,
          title: "Essence Mascara Lash Princess",
          description: "The Essence Mascara Lash Princess is a popular mascara known for its volumizing effect.",
          category: "beauty",
          price: 9.99,
          rating: 4.94,
          stock: 5,
          brand: "Essence"
        }
      ],
      total: 194,
      skip: 0,
      limit: 10
    },
    statusCodes: [COMMON_STATUS_CODES[0], COMMON_STATUS_CODES[1], COMMON_STATUS_CODES[2]]
  },

  // 6. Mock API - Resource by ID
  {
    id: 'mock-resource-by-id',
    category: 'mock',
    categoryTitle: 'Mock API',
    method: 'GET',
    path: '/mock/:type/:id',
    title: 'Mock API Resource by ID',
    shortDescription: 'Fetch a single mock resource by its specific identifier.',
    description: 'Retrieves a single complete mock entity record from the mock database.',
    notes: [
      'Supported types: products, carts, users, posts, comments, quotes, todos, recipes.'
    ],
    pathParams: [
      {
        name: 'type',
        label: 'Resource Type',
        type: 'enum',
        required: true,
        description: 'The dataset type.',
        defaultValue: 'products',
        options: [
          { label: 'Products', value: 'products' },
          { label: 'Recipes', value: 'recipes' },
          { label: 'Users', value: 'users' },
          { label: 'Posts', value: 'posts' },
          { label: 'Quotes', value: 'quotes' },
          { label: 'Carts', value: 'carts' },
          { label: 'Todos', value: 'todos' }
        ]
      },
      {
        name: 'id',
        label: 'Resource ID',
        type: 'number',
        required: true,
        description: 'Unique item ID.',
        defaultValue: '1',
        placeholder: 'e.g. 1'
      }
    ],
    queryParams: [],
    presets: [
      {
        id: 'product-1',
        label: 'Product #1',
        description: 'Fetch detailed product specification',
        pathParams: { type: 'products', id: '1' }
      },
      {
        id: 'recipe-1',
        label: 'Recipe #1',
        description: 'Fetch full recipe instructions and ingredients',
        pathParams: { type: 'recipes', id: '1' }
      },
      {
        id: 'quote-1',
        label: 'Quote #1',
        description: 'Fetch specific quote',
        pathParams: { type: 'quotes', id: '1' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/mock/products/1',
    exampleCurl: 'curl -X GET "https://free-api-server.vercel.app/mock/products/1"',
    responseExample: {
      id: 1,
      title: "Essence Mascara Lash Princess",
      description: "The Essence Mascara Lash Princess is a popular mascara...",
      price: 9.99,
      discountPercentage: 7.17,
      rating: 4.94,
      stock: 5,
      brand: "Essence",
      category: "beauty",
      thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
      images: [
        "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"
      ]
    },
    statusCodes: [COMMON_STATUS_CODES[0], COMMON_STATUS_CODES[1], COMMON_STATUS_CODES[2]]
  },

  // 7. Countries API
  {
    id: 'countries',
    category: 'countries',
    categoryTitle: 'Countries API',
    method: 'GET',
    path: '/countries',
    title: 'Country Lookup',
    shortDescription: 'Query comprehensive information about world countries, capitals, currencies, and regions.',
    description: 'Perform rich queries on global countries. Filter by country name, ISO code, currency, official language, capital city, region, or subregion. When type=all, returns global dataset.',
    notes: [
      'Supported lookup types: all, name, code, currency, lang, capital, region, subregion.',
      'For type=all, the "value" parameter is NOT required.',
      'For all other lookup types (name, code, currency, lang, capital, region, subregion), the "value" parameter IS required.',
      'Use the optional "fields" parameter to project only specified comma-separated keys.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Lookup Type',
        type: 'enum',
        required: true,
        description: 'The search criterion to lookup countries by.',
        defaultValue: 'all',
        options: [
          { label: 'All Countries (all)', value: 'all', description: 'Retrieve all countries (value is omitted)' },
          { label: 'Country Name (name)', value: 'name', description: 'Search by full or partial common/official name' },
          { label: 'Country Code (code)', value: 'code', description: 'Search by 2-letter or 3-letter ISO code (e.g. US, IND, FR)' },
          { label: 'Currency (currency)', value: 'currency', description: 'Search by ISO 4217 currency code (e.g. EUR, USD, JPY)' },
          { label: 'Language (lang)', value: 'lang', description: 'Search by language (e.g. spanish, english, french)' },
          { label: 'Capital City (capital)', value: 'capital', description: 'Search by capital city (e.g. tokyo, paris, london)' },
          { label: 'Region (region)', value: 'region', description: 'Filter by continent region (e.g. europe, asia, americas, africa)' },
          { label: 'Subregion (subregion)', value: 'subregion', description: 'Filter by subregion (e.g. northern europe, south asia)' }
        ]
      },
      {
        name: 'value',
        label: 'Lookup Value',
        type: 'string',
        required: false,
        description: 'The search term to match against. Required for all types except "all".',
        placeholder: 'e.g. india, FR, EUR, tokyo, europe'
      },
      {
        name: 'fields',
        label: 'Fields Filter (Projection)',
        type: 'string',
        required: false,
        description: 'Comma-separated list of keys to return (e.g. name,capital,currencies,flags,population).',
        placeholder: 'e.g. name,capital,currencies,flags'
      }
    ],
    presets: [
      {
        id: 'country-by-name-india',
        label: 'Search Name: India',
        description: 'Search for India by country name',
        queryParams: { type: 'name', value: 'india' }
      },
      {
        id: 'country-by-code-fr',
        label: 'Lookup Code: FR',
        description: 'Search France by 2-letter ISO code',
        queryParams: { type: 'code', value: 'FR' }
      },
      {
        id: 'country-by-currency-eur',
        label: 'Currency: EUR',
        description: 'Find all nations using the Euro',
        queryParams: { type: 'currency', value: 'EUR', fields: 'name,capital,currencies' }
      },
      {
        id: 'country-by-capital-tokyo',
        label: 'Capital: Tokyo',
        description: 'Lookup nation with capital Tokyo',
        queryParams: { type: 'capital', value: 'tokyo' }
      },
      {
        id: 'country-by-region-europe',
        label: 'Region: Europe',
        description: 'All European countries summary',
        queryParams: { type: 'region', value: 'europe', fields: 'name,capital,population' }
      },
      {
        id: 'all-countries-summary',
        label: 'All Countries Summary',
        description: 'Project name, capital, and region across all nations',
        queryParams: { type: 'all', fields: 'name,capital,region' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/countries?type=name&value=india',
    exampleCurl: 'curl -X GET "https://free-api-server.vercel.app/countries?type=name&value=india"',
    responseExample: [
      {
        name: {
          common: "India",
          official: "Republic of India",
          nativeName: {
            hin: { official: "भारत गणराज्य", common: "भारत" }
          }
        },
        tld: [".in"],
        cca2: "IN",
        cca3: "IND",
        currencies: {
          INR: { name: "Indian rupee", symbol: "₹" }
        },
        capital: ["New Delhi"],
        region: "Asia",
        subregion: "Southern Asia",
        languages: { eng: "English", hin: "Hindi" },
        latlng: [20.0, 77.0],
        population: 1407563842
      }
    ],
    statusCodes: [COMMON_STATUS_CODES[0], COMMON_STATUS_CODES[1], COMMON_STATUS_CODES[2], COMMON_STATUS_CODES[5]]
  },

  // 8. Weather API
  {
    id: 'weather',
    category: 'weather',
    categoryTitle: 'Weather API',
    method: 'GET',
    path: '/weather',
    title: 'Weather Forecast',
    shortDescription: 'High-precision real-time meteorological forecasts, current metrics, and hourly/daily projections.',
    description: 'Fetch current weather observations, hourly forecasts, and multi-day projections for any geographic coordinate worldwide. Requires latitude and longitude.',
    notes: [
      'Required parameters: latitude and longitude.',
      'Optional parameter "current": comma-separated variables such as temperature_2m, weather_code, wind_speed_10m, relative_humidity_2m.',
      'Optional parameter "hourly": comma-separated hourly series such as temperature_2m, precipitation, cloud_cover.',
      'Optional parameter "daily": comma-separated daily aggregates such as temperature_2m_max, temperature_2m_min, sunrise, sunset, precipitation_sum.',
      'Optional parameter "timezone": use "auto" to automatically resolve timezone from coordinates.',
      'Unit customization: temperatureUnit (celsius, fahrenheit), windSpeedUnit (kmh, ms, mph, kn), precipitationUnit (mm, inch).'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'latitude',
        label: 'Latitude (Req)',
        type: 'number',
        required: true,
        description: 'Geographical WGS84 latitude in decimal degrees.',
        defaultValue: '52.52',
        placeholder: 'e.g. 52.52'
      },
      {
        name: 'longitude',
        label: 'Longitude (Req)',
        type: 'number',
        required: true,
        description: 'Geographical WGS84 longitude in decimal degrees.',
        defaultValue: '13.41',
        placeholder: 'e.g. 13.41'
      },
      {
        name: 'current',
        label: 'Current Weather Variables',
        type: 'string',
        required: false,
        description: 'Comma-separated current weather variables.',
        defaultValue: 'temperature_2m,weather_code',
        placeholder: 'e.g. temperature_2m,weather_code,wind_speed_10m',
        example: 'temperature_2m,weather_code'
      },
      {
        name: 'hourly',
        label: 'Hourly Forecast Variables',
        type: 'string',
        required: false,
        description: 'Comma-separated variables for hourly time series.',
        placeholder: 'e.g. temperature_2m,relative_humidity_2m',
        example: 'temperature_2m'
      },
      {
        name: 'daily',
        label: 'Daily Aggregates',
        type: 'string',
        required: false,
        description: 'Comma-separated daily aggregated variables.',
        placeholder: 'e.g. temperature_2m_max,temperature_2m_min,precipitation_sum',
        example: 'temperature_2m_max'
      },
      {
        name: 'timezone',
        label: 'Timezone',
        type: 'string',
        required: false,
        description: 'Timezone for timestamps. Use "auto" to detect based on coordinates.',
        defaultValue: 'auto',
        placeholder: 'e.g. auto, UTC, America/New_York'
      },
      {
        name: 'forecastDays',
        label: 'Forecast Days',
        type: 'number',
        required: false,
        description: 'Number of forecast days to return (1-16).',
        placeholder: 'e.g. 3'
      },
      {
        name: 'pastDays',
        label: 'Past Days',
        type: 'number',
        required: false,
        description: 'Number of historical past days to include.',
        placeholder: 'e.g. 1'
      },
      {
        name: 'temperatureUnit',
        label: 'Temperature Unit',
        type: 'enum',
        required: false,
        description: 'Unit for temperature values.',
        options: [
          { label: 'Celsius (°C)', value: 'celsius' },
          { label: 'Fahrenheit (°F)', value: 'fahrenheit' }
        ]
      },
      {
        name: 'windSpeedUnit',
        label: 'Wind Speed Unit',
        type: 'enum',
        required: false,
        description: 'Unit for wind speed measurement.',
        options: [
          { label: 'km/h (kmh)', value: 'kmh' },
          { label: 'm/s (ms)', value: 'ms' },
          { label: 'mph (mph)', value: 'mph' },
          { label: 'knots (kn)', value: 'kn' }
        ]
      },
      {
        name: 'precipitationUnit',
        label: 'Precipitation Unit',
        type: 'enum',
        required: false,
        description: 'Unit for precipitation depth.',
        options: [
          { label: 'Millimeters (mm)', value: 'mm' },
          { label: 'Inches (inch)', value: 'inch' }
        ]
      }
    ],
    presets: [
      {
        id: 'weather-berlin-full',
        label: 'Berlin (Complete Forecast)',
        description: 'Berlin coordinates with current, hourly, and 3-day forecast',
        queryParams: {
          latitude: '52.52',
          longitude: '13.41',
          current: 'temperature_2m,weather_code',
          hourly: 'temperature_2m',
          daily: 'temperature_2m_max',
          forecastDays: '3',
          timezone: 'auto'
        }
      },
      {
        id: 'weather-nyc-fahrenheit',
        label: 'New York City (°F / mph)',
        description: 'New York with imperial units',
        queryParams: {
          latitude: '40.7128',
          longitude: '-74.0060',
          current: 'temperature_2m,weather_code,wind_speed_10m',
          temperatureUnit: 'fahrenheit',
          windSpeedUnit: 'mph',
          timezone: 'auto'
        }
      },
      {
        id: 'weather-tokyo-7days',
        label: 'Tokyo (7-Day Daily Trend)',
        description: 'Tokyo coordinates with 7 forecast days',
        queryParams: {
          latitude: '35.6762',
          longitude: '139.6503',
          daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
          forecastDays: '7',
          timezone: 'auto'
        }
      },
      {
        id: 'weather-london-current',
        label: 'London (Current Conditions)',
        description: 'Current temperature, humidity, wind & weather code',
        queryParams: {
          latitude: '51.5074',
          longitude: '-0.1278',
          current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
          timezone: 'auto'
        }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/weather?latitude=52.52&longitude=13.41&current=temperature_2m,weather_code&hourly=temperature_2m&daily=temperature_2m_max&forecastDays=3&timezone=auto',
    exampleCurl: 'curl -X GET "https://free-api-server.vercel.app/weather?latitude=52.52&longitude=13.41&current=temperature_2m,weather_code&hourly=temperature_2m&daily=temperature_2m_max&forecastDays=3&timezone=auto"',
    responseExample: {
      latitude: 52.52,
      longitude: 13.41,
      generationtime_ms: 0.124,
      utc_offset_seconds: 7200,
      timezone: "Europe/Berlin",
      timezone_abbreviation: "CEST",
      elevation: 38.0,
      current_units: {
        time: "iso8601",
        interval: "seconds",
        temperature_2m: "°C",
        weather_code: "wmo code"
      },
      current: {
        time: "2026-09-08T18:00",
        interval: 900,
        temperature_2m: 19.4,
        weather_code: 3
      }
    },
    statusCodes: [COMMON_STATUS_CODES[0], COMMON_STATUS_CODES[1], COMMON_STATUS_CODES[3], COMMON_STATUS_CODES[5]]
  }
];

export function getEndpointById(id: string): EndpointDefinition | undefined {
  return API_ENDPOINTS.find(e => e.id === id);
}
