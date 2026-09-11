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

  // 7. Geography API (Countries)
  {
    id: 'countries',
    category: 'geography',
    categoryTitle: 'Geography',
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
  },

  // 9. Pokémon API
  {
    id: 'pokemon',
    category: 'pokemon',
    categoryTitle: 'Pokémon',
    method: 'GET',
    path: '/pokemon',
    title: 'Pokémon API',
    shortDescription: 'The Pokémon API provides access to PokéAPI resources.',
    description: 'The Pokémon API provides access to PokéAPI resources. Query Pokémon, abilities, berries, moves, items, locations, and other game data with support for name/ID lookups and pagination.',
    notes: [
      'Upstream API: https://pokeapi.co/api/v2',
      'Default resource type is "pokemon" if not specified.',
      'Pass "value" with a resource name (e.g. "charizard", "thunderbolt") or numeric ID to fetch a specific resource.',
      'Use "limit" and "offset" for pagination when listing resources.',
      'Invalid resource types are returned as 400 Bad Request errors.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Resource Type',
        type: 'enum',
        required: false,
        defaultValue: 'pokemon',
        description: 'Pokémon resource type; defaults to pokemon.',
        options: [
          { label: 'pokemon', value: 'pokemon', description: 'Pokémon characters, stats, types, and sprites' },
          { label: 'ability', value: 'ability', description: 'Pokémon passive abilities and combat effects' },
          { label: 'berry', value: 'berry', description: 'Berries and their effects on Pokémon' },
          { label: 'characteristic', value: 'characteristic', description: 'Stat characteristics and descriptions' },
          { label: 'eggGroup', value: 'eggGroup', description: 'Egg groups determining breeding compatibility' },
          { label: 'gender', value: 'gender', description: 'Gender differences and rates for Pokémon' },
          { label: 'growthRate', value: 'growthRate', description: 'Experience growth rates for leveling up' },
          { label: 'item', value: 'item', description: 'In-game items, medicines, and held objects' },
          { label: 'itemAttribute', value: 'itemAttribute', description: 'Attributes applied to item effects' },
          { label: 'itemCategory', value: 'itemCategory', description: 'Categories grouping related items' },
          { label: 'itemFlingEffect', value: 'itemFlingEffect', description: 'Item effects when using the move Fling' },
          { label: 'itemPocket', value: 'itemPocket', description: 'Inventory pockets holding items' },
          { label: 'location', value: 'location', description: 'In-game geographical areas and landmarks' },
          { label: 'locationArea', value: 'locationArea', description: 'Sub-areas within game locations' },
          { label: 'machine', value: 'machine', description: 'Technical and Hidden Machines (TMs & HMs)' },
          { label: 'move', value: 'move', description: 'Combat moves, power, accuracy, and PP' },
          { label: 'nature', value: 'nature', description: 'Natures affecting Pokémon stat growth' },
          { label: 'palParkArea', value: 'palParkArea', description: 'Pal Park areas from Generation IV' },
          { label: 'pokeathlonStat', value: 'pokeathlonStat', description: 'Pokéathlon mini-game performance stats' },
          { label: 'pokedex', value: 'pokedex', description: 'Regional and national Pokédex listings' },
          { label: 'region', value: 'region', description: 'Major Pokémon game regions (Kanto, Johto, etc.)' },
          { label: 'stat', value: 'stat', description: 'Core battle statistics (HP, Attack, Speed, etc.)' },
          { label: 'type', value: 'type', description: 'Elemental types (Fire, Water, Grass, Electric, etc.)' },
          { label: 'version', value: 'version', description: 'Game versions within the Pokémon franchise' },
          { label: 'versionGroup', value: 'versionGroup', description: 'Groupings of game versions' }
        ]
      },
      {
        name: 'value',
        label: 'Resource Name or ID',
        type: 'string',
        required: false,
        placeholder: 'e.g. charizard, thunderbolt, 25',
        description: 'Resource name or ID to retrieve a single specific resource.'
      },
      {
        name: 'limit',
        label: 'Limit',
        type: 'number',
        required: false,
        placeholder: 'e.g. 20',
        description: 'Number of list results to return.'
      },
      {
        name: 'offset',
        label: 'Offset',
        type: 'number',
        required: false,
        placeholder: 'e.g. 0',
        description: 'Number of list results to skip.'
      }
    ],
    presets: [
      {
        id: 'pokemon-default',
        label: 'Default',
        description: 'Fetch default Pokémon list (GET /pokemon)',
        queryParams: { type: 'pokemon' }
      },
      {
        id: 'pokemon-by-name',
        label: 'Pokémon by name',
        description: 'Fetch Charizard details (GET /pokemon?type=pokemon&value=charizard)',
        queryParams: { type: 'pokemon', value: 'charizard' }
      },
      {
        id: 'pokemon-move-by-name',
        label: 'Move by name',
        description: 'Fetch Thunderbolt move details (GET /pokemon?type=move&value=thunderbolt)',
        queryParams: { type: 'move', value: 'thunderbolt' }
      },
      {
        id: 'pokemon-pagination',
        label: 'Pagination',
        description: 'Fetch paginated Pokémon list with limit and offset (GET /pokemon?type=pokemon&limit=20&offset=20)',
        queryParams: { type: 'pokemon', limit: '20', offset: '20' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/pokemon?type=pokemon&value=charizard',
    exampleCurl: 'curl "http://localhost:3000/pokemon?type=pokemon&value=charizard"',
    responseExample: {
      id: 6,
      name: "charizard",
      base_experience: 267,
      height: 17,
      is_default: true,
      order: 7,
      weight: 905,
      abilities: [
        {
          ability: {
            name: "blaze",
            url: "https://pokeapi.co/api/v2/ability/66/"
          },
          is_hidden: false,
          slot: 1
        },
        {
          ability: {
            name: "solar-power",
            url: "https://pokeapi.co/api/v2/ability/94/"
          },
          is_hidden: true,
          slot: 3
        }
      ],
      types: [
        {
          slot: 1,
          type: {
            name: "fire",
            url: "https://pokeapi.co/api/v2/type/10/"
          }
        },
        {
          slot: 2,
          type: {
            name: "flying",
            url: "https://pokeapi.co/api/v2/type/3/"
          }
        }
      ],
      stats: [
        { base_stat: 78, effort: 0, stat: { name: "hp" } },
        { base_stat: 84, effort: 0, stat: { name: "attack" } },
        { base_stat: 78, effort: 0, stat: { name: "defense" } },
        { base_stat: 109, effort: 3, stat: { name: "special-attack" } },
        { base_stat: 85, effort: 0, stat: { name: "special-defense" } },
        { base_stat: 100, effort: 0, stat: { name: "speed" } }
      ],
      sprites: {
        front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/6.png"
      }
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: 'Invalid resource type or invalid query parameters provided.',
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: 'Invalid resource type'
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 10. Rick and Morty API
  {
    id: 'rick-and-morty',
    category: 'rick-and-morty',
    categoryTitle: 'Rick and Morty',
    method: 'GET',
    path: '/rick-and-morty',
    title: 'Rick and Morty API',
    shortDescription: 'The Rick and Morty API provides access to characters, locations, and episodes.',
    description: 'The Rick and Morty API provides access to characters, locations, and episodes from the Rick and Morty universe. Filter characters by status, species, gender, or type, query locations by dimension, or look up episodes by episode code.',
    notes: [
      'Upstream API: https://rickandmortyapi.com/api',
      'Resource type defaults to "character" (options: character, location, episode).',
      'Pass "value" with a resource ID or name to fetch a specific record directly.',
      'All query parameters other than "resource" and "value" are forwarded directly to the upstream API.',
      'Invalid resource types are returned as 400 Bad Request errors.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'resource',
        label: 'Resource Type',
        type: 'enum',
        required: false,
        defaultValue: 'character',
        description: 'Resource type: character, location, or episode; defaults to character.',
        options: [
          { label: 'character', value: 'character', description: 'Characters, statuses, species, origins, and avatar images' },
          { label: 'location', value: 'location', description: 'Planets, space stations, dimensions, and resident character lists' },
          { label: 'episode', value: 'episode', description: 'Show episodes, season air dates, and character appearance lists' }
        ]
      },
      {
        name: 'value',
        label: 'Resource Name or ID',
        type: 'string',
        required: false,
        placeholder: 'e.g. 2, rick, 1',
        description: 'Resource name or ID to retrieve a single specific resource.'
      },
      {
        name: 'page',
        label: 'Page Number',
        type: 'number',
        required: false,
        placeholder: 'e.g. 1',
        description: 'Page number for list requests.'
      },
      {
        name: 'name',
        label: 'Name Filter',
        type: 'string',
        required: false,
        placeholder: 'e.g. rick, morty, smith',
        description: 'Character name filter.'
      },
      {
        name: 'status',
        label: 'Status Filter',
        type: 'enum',
        required: false,
        description: 'Character status filter.',
        options: [
          { label: 'alive', value: 'alive', description: 'Alive characters' },
          { label: 'dead', value: 'dead', description: 'Deceased characters' },
          { label: 'unknown', value: 'unknown', description: 'Unknown status' }
        ]
      },
      {
        name: 'species',
        label: 'Species Filter',
        type: 'string',
        required: false,
        placeholder: 'e.g. human, alien, robot, humanoid',
        description: 'Character species filter.'
      },
      {
        name: 'gender',
        label: 'Gender Filter',
        type: 'enum',
        required: false,
        description: 'Character gender filter.',
        options: [
          { label: 'female', value: 'female', description: 'Female characters' },
          { label: 'male', value: 'male', description: 'Male characters' },
          { label: 'genderless', value: 'genderless', description: 'Genderless characters' },
          { label: 'unknown', value: 'unknown', description: 'Unknown gender' }
        ]
      },
      {
        name: 'type',
        label: 'Type / Subspecies',
        type: 'string',
        required: false,
        placeholder: 'e.g. parasite, genetic experiment',
        description: 'Character type or subspecies filter.'
      },
      {
        name: 'dimension',
        label: 'Dimension Filter',
        type: 'string',
        required: false,
        placeholder: 'e.g. Dimension C-137, Replacement Dimension',
        description: 'Location dimension filter.'
      },
      {
        name: 'episode',
        label: 'Episode Code Filter',
        type: 'string',
        required: false,
        placeholder: 'e.g. S01E01, S03E03',
        description: 'Episode code filter (e.g. S01E01).'
      }
    ],
    presets: [
      {
        id: 'rick-and-morty-default',
        label: 'Default Characters',
        description: 'Fetch default character list (GET /rick-and-morty)',
        queryParams: { resource: 'character' }
      },
      {
        id: 'rick-and-morty-char-2',
        label: 'Character #2',
        description: 'Fetch Morty Smith by ID (GET /rick-and-morty?resource=character&value=2)',
        queryParams: { resource: 'character', value: '2' }
      },
      {
        id: 'rick-and-morty-rick-alive',
        label: 'Rick — Alive',
        description: 'Search alive characters named Rick (GET /rick-and-morty?resource=character&name=rick&status=alive)',
        queryParams: { resource: 'character', name: 'rick', status: 'alive' }
      },
      {
        id: 'rick-and-morty-episode-1',
        label: 'Episode #1',
        description: 'Fetch Pilot episode by ID (GET /rick-and-morty?resource=episode&value=1)',
        queryParams: { resource: 'episode', value: '1' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/rick-and-morty?resource=character&value=2',
    exampleCurl: 'curl "http://localhost:3000/rick-and-morty?resource=character&value=2"',
    responseExample: {
      id: 2,
      name: "Morty Smith",
      status: "Alive",
      species: "Human",
      type: "",
      gender: "Male",
      origin: {
        name: "Earth (C-137)",
        url: "https://rickandmortyapi.com/api/location/1"
      },
      location: {
        name: "Citadel of Ricks",
        url: "https://rickandmortyapi.com/api/location/3"
      },
      image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
      episode: [
        "https://rickandmortyapi.com/api/episode/1",
        "https://rickandmortyapi.com/api/episode/2"
      ],
      url: "https://rickandmortyapi.com/api/character/2",
      created: "2017-11-04T18:50:21.651Z"
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: 'Invalid resource type or invalid query parameters provided.',
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: 'Invalid resource type'
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 11. Cat Facts API
  {
    id: 'cat-facts',
    category: 'cat-facts',
    categoryTitle: 'Cat Facts',
    method: 'GET',
    path: '/cat-facts',
    title: 'Cat Facts API',
    shortDescription: 'The Cat Facts API provides random cat facts and collections of cat facts.',
    description: 'The Cat Facts API provides random cat facts and collections of cat facts. Supports requesting a single random fact or a paginated collection of facts, with optional max_length, limit, and page filters.',
    notes: [
      'Upstream API: https://catfact.ninja',
      'Default response type is "fact" if not specified.',
      'Set "type" to "facts" to retrieve a paginated collection of cat facts.',
      'Use "max_length" to constrain the maximum character length for a single fact.',
      'Additional query parameters are forwarded to the upstream API.',
      'Invalid response types are returned as 400 Bad Request errors.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Response Type',
        type: 'enum',
        required: false,
        defaultValue: 'fact',
        description: 'Response type: fact or facts; defaults to fact.',
        options: [
          { label: 'fact', value: 'fact', description: 'Single random cat fact object with fact and length' },
          { label: 'facts', value: 'facts', description: 'Paginated list of cat facts with pagination metadata' }
        ]
      },
      {
        name: 'max_length',
        label: 'Max Length',
        type: 'number',
        required: false,
        placeholder: 'e.g. 140',
        description: 'Maximum length for a single fact.'
      },
      {
        name: 'limit',
        label: 'Limit',
        type: 'number',
        required: false,
        placeholder: 'e.g. 10',
        description: 'Number of facts for the facts response.'
      },
      {
        name: 'page',
        label: 'Page Number',
        type: 'number',
        required: false,
        placeholder: 'e.g. 1',
        description: 'Page number for the facts response.'
      }
    ],
    presets: [
      {
        id: 'cat-facts-default',
        label: 'Random Cat Fact',
        description: 'Fetch a single random cat fact (GET /cat-facts)',
        queryParams: { type: 'fact' }
      },
      {
        id: 'cat-facts-list',
        label: 'Cat Facts List',
        description: 'Fetch 10 cat facts with pagination (GET /cat-facts?type=facts&limit=10)',
        queryParams: { type: 'facts', limit: '10' }
      },
      {
        id: 'cat-facts-short',
        label: 'Short Cat Fact',
        description: 'Fetch a short cat fact under 140 characters (GET /cat-facts?type=fact&max_length=140)',
        queryParams: { type: 'fact', max_length: '140' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/cat-facts?type=facts&limit=10',
    exampleCurl: 'curl "http://localhost:3000/cat-facts?type=facts&limit=10"',
    responseExample: {
      fact: "A cat's hearing is much more sensitive than humans and dogs.",
      length: 60
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: 'Invalid response type or query parameters provided.',
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: 'Invalid response type. Allowed values are fact or facts.'
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 12. Dogs API
  {
    id: 'dogs',
    category: 'dogs',
    categoryTitle: 'Dogs',
    method: 'GET',
    path: '/dogs',
    title: 'Dogs API',
    shortDescription: 'The Dogs API provides dog images and breed information through the Dog API.',
    description: 'The Dogs API provides dog images and breed information through the Dog API. Supports retrieving random dog pictures, multiple random pictures, breed-specific photos, full breed lists, sub-breeds, and verifying if a breed exists.',
    notes: [
      'Upstream API: https://dog.ceo/api',
      'Operation type defaults to "random" if not specified.',
      'Breed-specific operations (breedImage, breedImages, subBreeds, breedExists) require the "breed" parameter.',
      'Pass "subBreed" for sub-breed specific lookups when required.',
      'Use "limit" to specify the number of results for supported multi-image operations (e.g. randomMultiple).',
      'Invalid operation types or missing required values return 400 Bad Request.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Operation Type',
        type: 'enum',
        required: false,
        defaultValue: 'random',
        description: 'Operation type; defaults to random.',
        options: [
          { label: 'random', value: 'random', description: 'Single random dog image URL' },
          { label: 'randomMultiple', value: 'randomMultiple', description: 'Multiple random dog image URLs (use limit)' },
          { label: 'breedImage', value: 'breedImage', description: 'Random image for a specific breed (requires breed)' },
          { label: 'breedImages', value: 'breedImages', description: 'All image URLs for a specific breed (requires breed)' },
          { label: 'breedList', value: 'breedList', description: 'List of all breeds and their sub-breeds' },
          { label: 'subBreeds', value: 'subBreeds', description: 'List of all sub-breeds for a given breed (requires breed)' },
          { label: 'breedExists', value: 'breedExists', description: 'Verify whether a breed exists in the registry (requires breed)' }
        ]
      },
      {
        name: 'breed',
        label: 'Breed Name',
        type: 'string',
        required: false,
        placeholder: 'e.g. hound, bulldog, retriever, husky',
        description: 'Breed name for breed-specific operations (required for breedImage, breedImages, subBreeds, breedExists).'
      },
      {
        name: 'subBreed',
        label: 'Sub-Breed Name',
        type: 'string',
        required: false,
        placeholder: 'e.g. afghan, english, golden',
        description: 'Sub-breed name when required.'
      },
      {
        name: 'limit',
        label: 'Limit',
        type: 'number',
        required: false,
        placeholder: 'e.g. 5',
        description: 'Number of results for supported list operations (e.g. randomMultiple).'
      }
    ],
    presets: [
      {
        id: 'dogs-random',
        label: 'Random Dog',
        description: 'Fetch a single random dog image (GET /dogs)',
        queryParams: { type: 'random' }
      },
      {
        id: 'dogs-random-multiple',
        label: 'Multiple Random Dogs',
        description: 'Fetch 5 random dog images (GET /dogs?type=randomMultiple&limit=5)',
        queryParams: { type: 'randomMultiple', limit: '5' }
      },
      {
        id: 'dogs-hound-image',
        label: 'Hound Image',
        description: 'Fetch a random image of a hound (GET /dogs?type=breedImage&breed=hound)',
        queryParams: { type: 'breedImage', breed: 'hound' }
      },
      {
        id: 'dogs-bulldog-images',
        label: 'Bulldog Images',
        description: 'Fetch all bulldog images (GET /dogs?type=breedImages&breed=bulldog)',
        queryParams: { type: 'breedImages', breed: 'bulldog' }
      },
      {
        id: 'dogs-hound-subbreeds',
        label: 'Hound Sub-Breeds',
        description: 'List all hound sub-breeds (GET /dogs?type=subBreeds&breed=hound)',
        queryParams: { type: 'subBreeds', breed: 'hound' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/dogs?type=breedImages&breed=bulldog',
    exampleCurl: 'curl "http://localhost:3000/dogs?type=breedImages&breed=bulldog"',
    responseExample: {
      message: [
        "https://images.dog.ceo/breeds/bulldog-boston/20200710_175933.jpg",
        "https://images.dog.ceo/breeds/bulldog-boston/20200710_175944.jpg"
      ],
      status: "success"
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: 'Invalid operation type or missing required breed parameter.',
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: 'Breed name is required for breed-specific operations.'
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 13. Jikan API
  {
    id: 'jikan',
    category: 'jikan',
    categoryTitle: 'Jikan',
    method: 'GET',
    path: '/jikan',
    title: 'Jikan API',
    shortDescription: 'The Jikan API provides access to MyAnimeList data for anime, manga, characters, and people.',
    description: 'The Jikan API provides access to MyAnimeList data for anime, manga, characters, and people. Supports searching catalogues, retrieving comprehensive resource details, character rosters, episode listings, staff, news, reviews, and recommendations.',
    notes: [
      'Upstream API: https://api.jikan.moe/v4',
      'Resource or operation type defaults to "anime" if not specified.',
      'Operations containing an ID placeholder require the "value" parameter (e.g. animeFull, animeCharacters, mangaFull, characterFull, personFull).',
      'List operations support "limit" and "page" for result pagination.',
      'Invalid types or missing required values return 400 Bad Request.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Resource / Operation Type',
        type: 'enum',
        required: false,
        defaultValue: 'anime',
        description: 'Jikan resource or operation; defaults to anime.',
        options: [
          { label: 'anime', value: 'anime', description: 'Anime search and listing (or single anime when value is provided)' },
          { label: 'manga', value: 'manga', description: 'Manga search and listing (or single manga when value is provided)' },
          { label: 'characters', value: 'characters', description: 'Characters search and listing (or single character when value is provided)' },
          { label: 'people', value: 'people', description: 'People/voice actors search and listing (or single person when value is provided)' },
          { label: 'producers', value: 'producers', description: 'Anime producers and animation studios list' },
          { label: 'magazines', value: 'magazines', description: 'Manga magazine publishers list' },
          { label: 'genres', value: 'genres', description: 'Anime and manga genres list' },
          { label: 'themes', value: 'themes', description: 'Anime and manga themes list' },
          { label: 'demographics', value: 'demographics', description: 'Demographics list (e.g. Shounen, Seinen, Shoujo)' },
          { label: 'animeGenres', value: 'animeGenres', description: 'Explicit anime genres list' },
          { label: 'mangaGenres', value: 'mangaGenres', description: 'Explicit manga genres list' },
          { label: 'animeThemes', value: 'animeThemes', description: 'Explicit anime themes list' },
          { label: 'mangaThemes', value: 'mangaThemes', description: 'Explicit manga themes list' },
          { label: 'animeFull', value: 'animeFull', description: 'Full comprehensive anime details (requires value)' },
          { label: 'animeCharacters', value: 'animeCharacters', description: 'Characters in anime by ID (requires value)' },
          { label: 'animeStaff', value: 'animeStaff', description: 'Staff members for anime by ID (requires value)' },
          { label: 'animeEpisodes', value: 'animeEpisodes', description: 'Episodes list for anime by ID (requires value)' },
          { label: 'animeNews', value: 'animeNews', description: 'News related to anime by ID (requires value)' },
          { label: 'animeRecommendations', value: 'animeRecommendations', description: 'Anime recommendations by ID (requires value)' },
          { label: 'animeReviews', value: 'animeReviews', description: 'User reviews for anime by ID (requires value)' },
          { label: 'animePictures', value: 'animePictures', description: 'Image galleries for anime by ID (requires value)' },
          { label: 'animeVideos', value: 'animeVideos', description: 'Trailers, PVs, and clips for anime by ID (requires value)' },
          { label: 'animeRelations', value: 'animeRelations', description: 'Related anime, prequel/sequel relations by ID (requires value)' },
          { label: 'animeStreaming', value: 'animeStreaming', description: 'Official legal streaming links by ID (requires value)' },
          { label: 'mangaFull', value: 'mangaFull', description: 'Full comprehensive manga details (requires value)' },
          { label: 'mangaCharacters', value: 'mangaCharacters', description: 'Characters appearing in manga by ID (requires value)' },
          { label: 'mangaNews', value: 'mangaNews', description: 'News related to manga by ID (requires value)' },
          { label: 'mangaRecommendations', value: 'mangaRecommendations', description: 'Manga recommendations by ID (requires value)' },
          { label: 'mangaReviews', value: 'mangaReviews', description: 'User reviews for manga by ID (requires value)' },
          { label: 'mangaPictures', value: 'mangaPictures', description: 'Image galleries for manga by ID (requires value)' },
          { label: 'characterFull', value: 'characterFull', description: 'Full character profile by ID (requires value)' },
          { label: 'characterPictures', value: 'characterPictures', description: 'Pictures of character by ID (requires value)' },
          { label: 'personFull', value: 'personFull', description: 'Full person/staff profile by ID (requires value)' },
          { label: 'personPictures', value: 'personPictures', description: 'Pictures of person by ID (requires value)' }
        ]
      },
      {
        name: 'value',
        label: 'Resource ID',
        type: 'string',
        required: false,
        placeholder: 'e.g. 1, 20, 5114',
        description: 'Anime, manga, character, or person ID when required (e.g. 1 for Cowboy Bebop).'
      },
      {
        name: 'limit',
        label: 'Limit',
        type: 'number',
        required: false,
        placeholder: 'e.g. 10',
        description: 'Number of list results.'
      },
      {
        name: 'page',
        label: 'Page Number',
        type: 'number',
        required: false,
        placeholder: 'e.g. 2',
        description: 'Page number for paginated results.'
      }
    ],
    presets: [
      {
        id: 'jikan-anime',
        label: 'Anime',
        description: 'Fetch default anime list (GET /jikan)',
        queryParams: { type: 'anime' }
      },
      {
        id: 'jikan-anime-1',
        label: 'Anime #1',
        description: 'Fetch Cowboy Bebop by ID (GET /jikan?type=anime&value=1)',
        queryParams: { type: 'anime', value: '1' }
      },
      {
        id: 'jikan-anime-full-1',
        label: 'Anime Full #1',
        description: 'Fetch full Cowboy Bebop details (GET /jikan?type=animeFull&value=1)',
        queryParams: { type: 'animeFull', value: '1' }
      },
      {
        id: 'jikan-anime-page-2',
        label: 'Anime Page 2',
        description: 'Fetch page 2 of anime list with limit 10 (GET /jikan?type=anime&limit=10&page=2)',
        queryParams: { type: 'anime', limit: '10', page: '2' }
      },
      {
        id: 'jikan-anime-characters',
        label: 'Anime Characters',
        description: 'Fetch characters for anime #1 (GET /jikan?type=animeCharacters&value=1)',
        queryParams: { type: 'animeCharacters', value: '1' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/jikan?type=anime&value=1',
    exampleCurl: 'curl "http://localhost:3000/jikan?type=anime&value=1"',
    responseExample: {
      data: {
        mal_id: 1,
        url: "https://myanimelist.net/anime/1/Cowboy_Bebop",
        images: {
          jpg: {
            image_url: "https://cdn.myanimelist.net/images/anime/4/19644.jpg"
          }
        },
        title: "Cowboy Bebop",
        title_english: "Cowboy Bebop",
        title_japanese: "カウボーイビバップ",
        type: "TV",
        source: "Original",
        episodes: 26,
        status: "Finished Airing",
        score: 8.75,
        year: 1998
      }
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: 'Invalid type or missing required value parameter.',
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: 'Resource ID is required for this operation'
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 14. CoinGecko API
  {
    id: 'coingecko',
    category: 'coingecko',
    categoryTitle: 'CoinGecko',
    method: 'GET',
    path: '/coingecko',
    title: 'CoinGecko API',
    shortDescription: 'The CoinGecko API provides cryptocurrency prices, market data, and metadata.',
    description: 'The CoinGecko API provides cryptocurrency prices, market data, and metadata. Supports price lookups, comprehensive coin metadata, top trending coins, global market statistics, category listings, exchange data, derivatives, and NFT market statistics.',
    notes: [
      'Upstream API: https://api.coingecko.com/api/v3',
      'Operation type defaults to "ping" if not specified.',
      'Operations requiring an ID (coin, exchange, exchangeTickers, nft) require the "value" parameter.',
      'Use "ids" and "vs_currencies" for the "simplePrice" operation.',
      'Use "vs_currency", "order", "per_page", and "page" for market rankings.',
      'Use "query" for search operations.',
      'Invalid operation types or missing required values return 400 Bad Request.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Operation Type',
        type: 'enum',
        required: false,
        defaultValue: 'ping',
        description: 'CoinGecko operation; defaults to ping.',
        options: [
          { label: 'ping', value: 'ping', description: 'Check API server status' },
          { label: 'simplePrice', value: 'simplePrice', description: 'Get current prices of tokens by ids and vs_currencies' },
          { label: 'coins', value: 'coins', description: 'List all supported coins with id, name, and symbol' },
          { label: 'coin', value: 'coin', description: 'Get current data and metadata for a coin by ID (requires value)' },
          { label: 'coinMarkets', value: 'coinMarkets', description: 'List coin market data with price, volume, and rank' },
          { label: 'markets', value: 'markets', description: 'Get market data for coins with vs_currency, order, and pagination' },
          { label: 'trending', value: 'trending', description: 'Top-7 trending search coins and NFTs on CoinGecko' },
          { label: 'search', value: 'search', description: 'Search for coins, categories, and markets by query' },
          { label: 'global', value: 'global', description: 'Global cryptocurrency market metrics' },
          { label: 'globalDefi', value: 'globalDefi', description: 'Global DeFi market metrics including market cap and dominance' },
          { label: 'categories', value: 'categories', description: 'List all cryptocurrency categories with market data' },
          { label: 'categoriesList', value: 'categoriesList', description: 'List all cryptocurrency category names and IDs' },
          { label: 'exchanges', value: 'exchanges', description: 'List all active cryptocurrency exchanges' },
          { label: 'exchange', value: 'exchange', description: 'Get exchange volume and metadata by ID (requires value)' },
          { label: 'exchangeTickers', value: 'exchangeTickers', description: 'Get exchange tickers by ID (requires value)' },
          { label: 'derivatives', value: 'derivatives', description: 'List all derivative tickers' },
          { label: 'derivativesExchanges', value: 'derivativesExchanges', description: 'List all derivative exchanges' },
          { label: 'assetPlatforms', value: 'assetPlatforms', description: 'List all asset platforms / blockchain networks' },
          { label: 'nfts', value: 'nfts', description: 'List all supported NFT collections with ID and contract' },
          { label: 'nft', value: 'nft', description: 'Get NFT collection data and floor price by ID (requires value)' }
        ]
      },
      {
        name: 'value',
        label: 'Value / ID',
        type: 'string',
        required: false,
        placeholder: 'e.g. bitcoin, binance, bored-ape-yacht-club',
        description: 'Coin, exchange, or NFT ID when required (e.g. bitcoin for coin details).'
      },
      {
        name: 'ids',
        label: 'Coin IDs',
        type: 'string',
        required: false,
        placeholder: 'e.g. bitcoin,ethereum,solana',
        description: 'Comma-separated coin IDs.'
      },
      {
        name: 'vs_currency',
        label: 'VS Currency',
        type: 'string',
        required: false,
        placeholder: 'e.g. usd, eur, btc',
        description: 'Target fiat or crypto currency for market rankings.'
      },
      {
        name: 'vs_currencies',
        label: 'VS Currencies',
        type: 'string',
        required: false,
        placeholder: 'e.g. usd,eur,inr',
        description: 'Target currencies for simple prices (comma-separated).'
      },
      {
        name: 'order',
        label: 'Order',
        type: 'string',
        required: false,
        placeholder: 'e.g. market_cap_desc',
        description: 'Market sorting order (e.g. market_cap_desc, gecko_desc, volume_desc).'
      },
      {
        name: 'per_page',
        label: 'Per Page',
        type: 'number',
        required: false,
        placeholder: 'e.g. 10',
        description: 'Results per page.'
      },
      {
        name: 'page',
        label: 'Page Number',
        type: 'number',
        required: false,
        placeholder: 'e.g. 1',
        description: 'Page number for paginated results.'
      },
      {
        name: 'query',
        label: 'Search Query',
        type: 'string',
        required: false,
        placeholder: 'e.g. bitcoin',
        description: 'Search term for querying coins, exchanges, and categories.'
      }
    ],
    presets: [
      {
        id: 'coingecko-ping',
        label: 'Ping',
        description: 'Check CoinGecko server status (GET /coingecko)',
        queryParams: { type: 'ping' }
      },
      {
        id: 'coingecko-bitcoin-price',
        label: 'Bitcoin Price',
        description: 'Get live BTC price in USD (GET /coingecko?type=simplePrice&ids=bitcoin&vs_currencies=usd)',
        queryParams: { type: 'simplePrice', ids: 'bitcoin', vs_currencies: 'usd' }
      },
      {
        id: 'coingecko-bitcoin-details',
        label: 'Bitcoin Details',
        description: 'Get comprehensive Bitcoin info (GET /coingecko?type=coin&value=bitcoin)',
        queryParams: { type: 'coin', value: 'bitcoin' }
      },
      {
        id: 'coingecko-market-data',
        label: 'Market Data',
        description: 'Top 10 cryptos by market cap (GET /coingecko?type=markets&vs_currency=usd&order=market_cap_desc&per_page=10&page=1)',
        queryParams: { type: 'markets', vs_currency: 'usd', order: 'market_cap_desc', per_page: '10', page: '1' }
      },
      {
        id: 'coingecko-trending',
        label: 'Trending',
        description: 'Get trending search coins on CoinGecko (GET /coingecko?type=trending)',
        queryParams: { type: 'trending' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/coingecko?type=simplePrice&ids=bitcoin&vs_currencies=usd',
    exampleCurl: 'curl "http://localhost:3000/coingecko?type=simplePrice&ids=bitcoin&vs_currencies=usd"',
    responseExample: {
      bitcoin: {
        usd: 68420.5
      }
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: 'Invalid operation type or missing required parameters.',
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: 'Value / ID is required for this operation'
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 15. IPify API
  {
    id: 'ipify',
    category: 'ipify',
    categoryTitle: 'IPify',
    method: 'GET',
    path: '/ipify',
    title: 'Public IP',
    shortDescription: 'The IPify API returns the public IP address of the requesting client.',
    description: 'The IPify API returns the public IP address of the requesting client. Responses are normalized into the standard service envelope and support both raw IP text and JSON formats depending on upstream response headers.',
    notes: [
      'Upstream API: https://api.ipify.org',
      'Response operation defaults to "ip".',
      'The endpoint is read-only and requires no authentication.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Type / Operation',
        type: 'enum',
        required: false,
        defaultValue: '',
        description: 'Response operation; currently ip, defaults to ip.',
        options: [
          { label: 'ip', value: 'ip', description: 'Public client IP address (default)' }
        ]
      }
    ],
    presets: [
      {
        id: 'ipify-default',
        label: 'Default Public IP',
        description: 'Get public IP address (GET /ipify)',
        queryParams: {}
      },
      {
        id: 'ipify-explicit',
        label: 'Explicit IP Operation',
        description: 'Get public IP with explicit type param (GET /ipify?type=ip)',
        queryParams: { type: 'ip' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/ipify',
    exampleCurl: 'curl http://localhost:3000/ipify',
    responseExample: {
      success: true,
      statusCode: 200,
      status: true,
      message: 'Success',
      data: {
        ip: '203.0.113.195'
      }
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      COMMON_STATUS_CODES[1],
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 16. Agify API
  {
    id: 'agify',
    category: 'agify',
    categoryTitle: 'Agify',
    method: 'GET',
    path: '/agify',
    title: 'Predict Age',
    shortDescription: 'The Agify API predicts the likely age of a person from their name.',
    description: 'The Agify API predicts the likely age of a person from their name. Supports optional country code filtering to improve age prediction accuracy.',
    notes: [
      'Upstream API: https://api.agify.io',
      'Response operation defaults to "age".',
      'The "name" parameter is required.',
      'The "country_id" parameter is an optional two-letter country code (e.g. US, IN, GB).',
      'Additional query parameters are forwarded to Agify.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Type / Operation',
        type: 'enum',
        required: false,
        defaultValue: '',
        description: 'Response operation; currently age, defaults to age.',
        options: [
          { label: 'age', value: 'age', description: 'Age prediction operation (default)' }
        ]
      },
      {
        name: 'name',
        label: 'Name',
        type: 'string',
        required: true,
        placeholder: 'e.g. michael',
        description: 'Name used for the age prediction.'
      },
      {
        name: 'country_id',
        label: 'Country ID',
        type: 'string',
        required: false,
        placeholder: 'e.g. US',
        description: 'Two-letter country code used to improve the prediction.'
      }
    ],
    presets: [
      {
        id: 'agify-michael',
        label: 'Michael',
        description: 'Predict age for Michael (GET /agify?name=michael)',
        queryParams: { name: 'michael' }
      },
      {
        id: 'agify-emma-us',
        label: 'Emma + US',
        description: 'Predict age for Emma in US (GET /agify?type=age&name=emma&country_id=US)',
        queryParams: { type: 'age', name: 'emma', country_id: 'US' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/agify?name=michael',
    exampleCurl: 'curl "http://localhost:3000/agify?name=michael"',
    responseExample: {
      success: true,
      statusCode: 200,
      status: true,
      data: {
        count: 233482,
        name: 'michael',
        age: 62
      }
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      COMMON_STATUS_CODES[1],
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 17. Genderize API
  {
    id: 'genderize',
    category: 'genderize',
    categoryTitle: 'Genderize',
    method: 'GET',
    path: '/genderize',
    title: 'Predict Gender',
    shortDescription: 'The Genderize API predicts the likely gender of a person from their name.',
    description: 'The Genderize API predicts the likely gender of a person from their name. Supports optional country code filtering to improve gender prediction accuracy.',
    notes: [
      'Upstream API: https://api.genderize.io',
      'Response operation defaults to "gender".',
      'The "name" parameter is required.',
      'The "country_id" parameter is an optional two-letter country code (e.g. US, IN, GB).',
      'Additional query parameters are forwarded to Genderize.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Type / Operation',
        type: 'enum',
        required: false,
        defaultValue: '',
        description: 'Response operation; currently gender, defaults to gender.',
        options: [
          { label: 'gender', value: 'gender', description: 'Gender prediction operation (default)' }
        ]
      },
      {
        name: 'name',
        label: 'Name',
        type: 'string',
        required: true,
        placeholder: 'e.g. michael',
        description: 'Name used for the gender prediction.'
      },
      {
        name: 'country_id',
        label: 'Country ID',
        type: 'string',
        required: false,
        placeholder: 'e.g. US',
        description: 'Two-letter country code used to improve the prediction.'
      }
    ],
    presets: [
      {
        id: 'genderize-michael',
        label: 'Michael',
        description: 'Predict gender for Michael (GET /genderize?name=michael)',
        queryParams: { name: 'michael' }
      },
      {
        id: 'genderize-emma-us',
        label: 'Emma + US',
        description: 'Predict gender for Emma in US (GET /genderize?type=gender&name=emma&country_id=US)',
        queryParams: { type: 'gender', name: 'emma', country_id: 'US' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/genderize?name=michael',
    exampleCurl: 'curl "http://localhost:3000/genderize?name=michael"',
    responseExample: {
      success: true,
      statusCode: 200,
      status: true,
      data: {
        count: 107560,
        name: 'michael',
        gender: 'male',
        probability: 1.0
      }
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      COMMON_STATUS_CODES[1],
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 18. Nationalize API
  {
    id: 'nationalize',
    category: 'nationalize',
    categoryTitle: 'Nationalize',
    method: 'GET',
    path: '/nationalize',
    title: 'Predict Nationality',
    shortDescription: 'The Nationalize API predicts the likely nationality of a person from their name.',
    description: 'The Nationalize API predicts the likely nationality of a person from their name. Supports optional country code filtering to narrow the nationality prediction.',
    notes: [
      'Upstream API: https://api.nationalize.io',
      'Response operation defaults to "nationality".',
      'The "name" parameter is required.',
      'The "country_id" parameter is an optional two-letter country code (e.g. US, IN, GB) used to narrow the prediction.',
      'Additional query parameters are forwarded to Nationalize.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Type / Operation',
        type: 'enum',
        required: false,
        defaultValue: '',
        description: 'Response operation; currently nationality, defaults to nationality.',
        options: [
          { label: 'nationality', value: 'nationality', description: 'Nationality prediction operation (default)' }
        ]
      },
      {
        name: 'name',
        label: 'Name',
        type: 'string',
        required: true,
        placeholder: 'e.g. michael',
        description: 'Name used for the nationality prediction.'
      },
      {
        name: 'country_id',
        label: 'Country ID',
        type: 'string',
        required: false,
        placeholder: 'e.g. US',
        description: 'Two-letter country code used to narrow the prediction.'
      }
    ],
    presets: [
      {
        id: 'nationalize-michael',
        label: 'Michael',
        description: 'Predict nationality for Michael (GET /nationalize?name=michael)',
        queryParams: { name: 'michael' }
      },
      {
        id: 'nationalize-emma-us',
        label: 'Emma + US',
        description: 'Predict nationality for Emma narrowed by US (GET /nationalize?type=nationality&name=emma&country_id=US)',
        queryParams: { type: 'nationality', name: 'emma', country_id: 'US' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/nationalize?name=michael',
    exampleCurl: 'curl "http://localhost:3000/nationalize?name=michael"',
    responseExample: {
      success: true,
      statusCode: 200,
      status: true,
      data: {
        count: 233482,
        name: 'michael',
        country: [
          {
            country_id: 'US',
            probability: 0.089
          },
          {
            country_id: 'AU',
            probability: 0.057
          },
          {
            country_id: 'NZ',
            probability: 0.046
          }
        ]
      }
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      COMMON_STATUS_CODES[1],
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 19. GitHub API
  {
    id: 'github',
    category: 'github',
    categoryTitle: 'GitHub',
    method: 'GET',
    path: '/github',
    title: 'GitHub API',
    shortDescription: 'Provides read-only access to users, repositories, searches, and repository metadata.',
    description: 'The GitHub API provides read-only access to users, repositories, searches, and repository metadata. Upstream responses from https://api.github.com are forwarded directly. Supports 17 operation types with intelligent conditional parameters and optional GITHUB_TOKEN backend rate-limit elevation.',
    notes: [
      'Upstream API: https://api.github.com',
      'Response operation defaults to "users".',
      'Default request GET /github lists public GitHub users.',
      'The endpoint is read-only. Authentication (GITHUB_TOKEN) is handled securely on the server.',
      'A 15-second timeout applies to upstream GitHub requests.',
      'Additional query parameters (such as state=open, per_page, etc.) are forwarded directly to GitHub.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Operation Type',
        type: 'enum',
        required: false,
        defaultValue: 'users',
        description: 'GitHub operation type; defaults to users.',
        options: [
          { label: 'users (List Users - default)', value: 'users', description: 'List public GitHub users (default)' },
          { label: 'user (Get User)', value: 'user', description: 'Get a user profile by username' },
          { label: 'repos (Get Repository)', value: 'repos', description: 'Get repository metadata and stats by owner & repo' },
          { label: 'userRepos (List User Repositories)', value: 'userRepos', description: 'List public repositories for a specific user' },
          { label: 'repoIssues (Repository Issues)', value: 'repoIssues', description: 'List repository issues (supports state filter)' },
          { label: 'repoPulls (Repository Pull Requests)', value: 'repoPulls', description: 'List pull requests for a repository' },
          { label: 'repoCommits (Repository Commits)', value: 'repoCommits', description: 'List commits for a repository' },
          { label: 'repoBranches (Repository Branches)', value: 'repoBranches', description: 'List branches of a repository' },
          { label: 'repoReleases (Repository Releases)', value: 'repoReleases', description: 'List releases for a repository' },
          { label: 'repoTags (Repository Tags)', value: 'repoTags', description: 'List tags for a repository' },
          { label: 'repoLanguages (Repository Languages)', value: 'repoLanguages', description: 'List programming languages for a repository' },
          { label: 'repoContributors (Repository Contributors)', value: 'repoContributors', description: 'List contributors for a repository' },
          { label: 'repoContents (Repository Contents)', value: 'repoContents', description: 'Get root directory contents for a repository' },
          { label: 'searchRepositories (Search Repositories)', value: 'searchRepositories', description: 'Search GitHub repositories by keyword' },
          { label: 'searchUsers (Search Users)', value: 'searchUsers', description: 'Search GitHub users by keyword' },
          { label: 'searchIssues (Search Issues)', value: 'searchIssues', description: 'Search GitHub issues by keyword' },
          { label: 'searchCommits (Search Commits)', value: 'searchCommits', description: 'Search GitHub commits by keyword' }
        ]
      },
      {
        name: 'username',
        label: 'Username',
        type: 'string',
        required: false,
        placeholder: 'e.g. octocat',
        description: 'GitHub username (used with type=user or type=userRepos).'
      },
      {
        name: 'owner',
        label: 'Owner',
        type: 'string',
        required: false,
        placeholder: 'e.g. octocat',
        description: 'Repository owner or organization login (used with repository operations).'
      },
      {
        name: 'repo',
        label: 'Repository',
        type: 'string',
        required: false,
        placeholder: 'e.g. Hello-World',
        description: 'Repository name (used with repository operations).'
      },
      {
        name: 'q',
        label: 'Search Query (q)',
        type: 'string',
        required: false,
        placeholder: 'e.g. javascript',
        description: 'Search query string (used with search operations).'
      },
      {
        name: 'state',
        label: 'State Filter',
        type: 'string',
        required: false,
        placeholder: 'e.g. open',
        description: 'State filter for issues/pull requests: open, closed, or all.'
      }
    ],
    presets: [
      {
        id: 'github-users',
        label: 'GitHub Users',
        description: 'List public users in GitHub (GET /github)',
        queryParams: { type: 'users' }
      },
      {
        id: 'github-user-octocat',
        label: 'Octocat User',
        description: 'Get Octocat user profile (GET /github?type=user&username=octocat)',
        queryParams: { type: 'user', username: 'octocat' }
      },
      {
        id: 'github-repo-hello-world',
        label: 'Hello World Repository',
        description: 'Get octocat/Hello-World repo metadata (GET /github?type=repos&owner=octocat&repo=Hello-World)',
        queryParams: { type: 'repos', owner: 'octocat', repo: 'Hello-World' }
      },
      {
        id: 'github-search-repos',
        label: 'Repository Search',
        description: 'Search repositories for "javascript" (GET /github?type=searchRepositories&q=javascript)',
        queryParams: { type: 'searchRepositories', q: 'javascript' }
      },
      {
        id: 'github-repo-issues',
        label: 'Open Issues',
        description: 'Get open issues for octocat/Hello-World (GET /github?type=repoIssues&owner=octocat&repo=Hello-World&state=open)',
        queryParams: { type: 'repoIssues', owner: 'octocat', repo: 'Hello-World', state: 'open' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/github?type=user&username=octocat',
    exampleCurl: 'curl "http://localhost:3000/github?type=user&username=octocat"',
    responseExample: {
      login: 'octocat',
      id: 583231,
      node_id: 'MDQ6VXNlcjU4MzIzMQ==',
      avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
      html_url: 'https://github.com/octocat',
      name: 'The Octocat',
      company: '@github',
      blog: 'https://github.blog',
      location: 'San Francisco',
      public_repos: 8,
      public_gists: 8,
      followers: 16540,
      following: 9,
      created_at: '2011-01-25T18:44:36Z',
      updated_at: '2024-03-22T14:12:08Z'
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: 'Invalid operation type or missing required parameters (owner, repo, username, or q).',
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: 'Missing required parameters: owner and repo'
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 20. Open Library API
  {
    id: 'open-library',
    category: 'open-library',
    categoryTitle: 'Open Library',
    method: 'GET',
    path: '/open-library',
    title: 'Open Library API',
    shortDescription: 'Provides book, edition, author, subject, and ISBN metadata.',
    description: 'The Open Library API provides book, edition, author, subject, and ISBN metadata. Responses forward data directly from Open Library (https://openlibrary.org). Supports 6 operation types: search, work, edition, author, subject, and isbn.',
    notes: [
      'Upstream API: https://openlibrary.org',
      'Response operation defaults to "search".',
      'Default request GET /open-library searches open library catalog.',
      'The endpoint is read-only.',
      'A 15-second timeout applies to upstream Open Library requests.',
      'Additional query parameters (such as title, fields, limit, etc.) are forwarded directly to Open Library.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Operation Type',
        type: 'enum',
        required: false,
        defaultValue: 'search',
        description: 'Open Library operation type; defaults to search.',
        options: [
          { label: 'search (Search Catalog - default)', value: 'search', description: 'Search for books, works, and editions by query or title' },
          { label: 'work (Work by ID)', value: 'work', description: 'Get work metadata by Open Library work ID (e.g. OL45804W)' },
          { label: 'edition (Edition by ID)', value: 'edition', description: 'Get edition metadata by Open Library edition ID (e.g. OL7353617M)' },
          { label: 'author (Author by ID)', value: 'author', description: 'Get author profile and details by author ID (e.g. OL23919A)' },
          { label: 'subject (Subject)', value: 'subject', description: 'Get works and editions under a subject heading (e.g. science_fiction)' },
          { label: 'isbn (ISBN Lookup)', value: 'isbn', description: 'Get book metadata by ISBN-10 or ISBN-13 (e.g. 9780140328721)' }
        ]
      },
      {
        name: 'q',
        label: 'Query (q)',
        type: 'string',
        required: false,
        placeholder: 'e.g. pride and prejudice',
        description: 'General search keyword query (used with type=search).'
      },
      {
        name: 'title',
        label: 'Title',
        type: 'string',
        required: false,
        placeholder: 'e.g. pride and prejudice',
        description: 'Search by book title (used with type=search).'
      },
      {
        name: 'value',
        label: 'Value / Identifier',
        type: 'string',
        required: false,
        placeholder: 'e.g. OL45804W',
        description: 'Open Library identifier (work ID, edition ID, author ID, subject heading, or ISBN).'
      }
    ],
    presets: [
      {
        id: 'open-library-search',
        label: 'Book Search',
        description: 'Search books for "pride and prejudice" (GET /open-library?type=search&q=pride+and+prejudice)',
        queryParams: { type: 'search', q: 'pride and prejudice' }
      },
      {
        id: 'open-library-work',
        label: 'Work (OL45804W)',
        description: 'Get work metadata by ID (GET /open-library?type=work&value=OL45804W)',
        queryParams: { type: 'work', value: 'OL45804W' }
      },
      {
        id: 'open-library-edition',
        label: 'Edition (OL7353617M)',
        description: 'Get edition metadata by ID (GET /open-library?type=edition&value=OL7353617M)',
        queryParams: { type: 'edition', value: 'OL7353617M' }
      },
      {
        id: 'open-library-author',
        label: 'Author (OL23919A)',
        description: 'Get author metadata by ID (GET /open-library?type=author&value=OL23919A)',
        queryParams: { type: 'author', value: 'OL23919A' }
      },
      {
        id: 'open-library-subject',
        label: 'Subject (science_fiction)',
        description: 'Get subject metadata (GET /open-library?type=subject&value=science_fiction)',
        queryParams: { type: 'subject', value: 'science_fiction' }
      },
      {
        id: 'open-library-isbn',
        label: 'ISBN (9780140328721)',
        description: 'Get book metadata by ISBN (GET /open-library?type=isbn&value=9780140328721)',
        queryParams: { type: 'isbn', value: '9780140328721' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/open-library?type=search&q=pride+and+prejudice',
    exampleCurl: 'curl "http://localhost:3000/open-library?type=search&q=pride+and+prejudice"',
    responseExample: {
      numFound: 1,
      start: 0,
      numFoundExact: true,
      docs: [
        {
          key: '/works/OL45804W',
          title: 'Pride and Prejudice',
          author_name: ['Jane Austen'],
          first_publish_year: 1813,
          isbn: ['9780140328721'],
          subject: ['Classic Literature', 'Sisters', 'Romance']
        }
      ]
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: "Missing required identifier 'value' for operation 'work', 'edition', 'author', 'subject', or 'isbn'.",
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: "Missing required 'value' parameter for type=work"
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 21. Gutendex API
  {
    id: 'gutendex',
    category: 'gutendex',
    categoryTitle: 'Gutendex',
    method: 'GET',
    path: '/gutendex',
    title: 'Gutendex API',
    shortDescription: 'Provides public-domain book metadata and catalog search from the Project Gutenberg collection.',
    description: 'The Gutendex API provides public-domain book metadata and catalog search from the Project Gutenberg collection. Responses forward data directly from Gutendex (https://gutendex.com). Supports 2 operation types: books (list books / catalog search) and book (get a specific book by Gutenberg ID).',
    badge: {
      text: 'Working on',
      icon: 'lock',
      type: 'warning'
    },
    warningNotice: 'Deployment & Reliability Notice: Gutendex upstream API has known latency/timeout issues in Vercel/serverless environments. Fully functional in local development, but Open Library (/open-library) is recommended for production books integration.',
    notes: [
      'Status: Working on / Lock tag (Unstable on Vercel deployments due to upstream Project Gutenberg latency)',
      'Upstream API: https://gutendex.com',
      'Recommended alternative for production/Vercel: Open Library API (/open-library)',
      'Response operation defaults to "books".',
      'Default request GET /gutendex lists public-domain books.',
      'The endpoint is read-only.',
      'A 15-second timeout applies to upstream Gutendex requests.',
      'Additional query parameters (such as search, languages, topic, author_year_start, etc.) are forwarded directly to Gutendex.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Operation Type',
        type: 'enum',
        required: false,
        defaultValue: 'books',
        description: 'Gutendex operation type; defaults to books.',
        options: [
          { label: 'books (List Books & Search - default)', value: 'books', description: 'List books with optional filters or search keyword' },
          { label: 'book (Book by ID)', value: 'book', description: 'Get a specific book by Gutenberg numeric ID (e.g. 11)' }
        ]
      },
      {
        name: 'search',
        label: 'Search Query',
        type: 'string',
        required: false,
        placeholder: 'e.g. frankenstein',
        description: 'Search term for titles and authors in the Gutenberg catalog (used with type=books).'
      },
      {
        name: 'value',
        label: 'Book ID (value)',
        type: 'string',
        required: false,
        placeholder: 'e.g. 11',
        description: 'Project Gutenberg book numeric identifier (required for type=book).'
      }
    ],
    presets: [
      {
        id: 'gutendex-all-books',
        label: 'All Books',
        description: 'List public-domain books (GET /gutendex)',
        queryParams: { type: 'books' }
      },
      {
        id: 'gutendex-search-frankenstein',
        label: 'Search Frankenstein',
        description: 'Search books for "frankenstein" (GET /gutendex?type=books&search=frankenstein)',
        queryParams: { type: 'books', search: 'frankenstein' }
      },
      {
        id: 'gutendex-book-id',
        label: 'Book by ID (11)',
        description: 'Get book metadata for ID 11 (GET /gutendex?type=book&value=11)',
        queryParams: { type: 'book', value: '11' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/gutendex?type=books&search=frankenstein',
    exampleCurl: 'curl "http://localhost:3000/gutendex?type=books&search=frankenstein"',
    responseExample: {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 84,
          title: 'Frankenstein; Or, The Modern Prometheus',
          authors: [
            {
              name: 'Shelley, Mary Wollstonecraft',
              birth_year: 1797,
              death_year: 1851
            }
          ],
          translators: [],
          subjects: [
            "Frankenstein's monster (Fictitious character) -- Fiction",
            'Frankenstein, Victor (Fictitious character) -- Fiction',
            'Gothic fiction',
            'Horror tales',
            'Monsters -- Fiction',
            'Science fiction',
            'Scientists -- Fiction'
          ],
          bookshelves: [
            'Gothic Fiction',
            'Movie Books',
            'Precursors of Science Fiction',
            'Science Fiction by Women'
          ],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/html': 'https://www.gutenberg.org/ebooks/84.html.images',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/84.epub3.images',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/84.kf8.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/84.rdf',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/ebooks/84.txt.utf-8'
          },
          download_count: 89452
        }
      ]
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: "Missing required identifier 'value' for operation 'book'.",
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: "Missing required 'value' parameter for type=book"
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 22. Open Food Facts API
  {
    id: 'open-food-facts',
    category: 'open-food-facts',
    categoryTitle: 'Open Food Facts',
    method: 'GET',
    path: '/open-food-facts',
    title: 'Open Food Facts API',
    shortDescription: 'Provides product metadata, categories, ingredients, labels, brands, additives, allergens, and packaging information.',
    description: 'The Open Food Facts API provides product metadata, categories, ingredients, labels, brands, additives, allergens, and packaging information from the Open Food Facts global open database. Responses forward data directly from Open Food Facts API v2 (https://world.openfoodfacts.org/api/v2).',
    notes: [
      'Upstream API: https://world.openfoodfacts.org/api/v2',
      'Response operation defaults to "product".',
      'Identifier-based operations require the "value" parameter and return 400 Bad Request if omitted.',
      'The endpoint is read-only.',
      'A 15-second timeout applies to upstream Open Food Facts requests.',
      'Additional query parameters are forwarded directly to Open Food Facts API v2.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Operation Type',
        type: 'enum',
        required: false,
        defaultValue: 'product',
        description: 'Open Food Facts operation type; defaults to product.',
        options: [
          { label: 'product (Product Barcode Lookup - default)', value: 'product', description: 'Product barcode lookup (requires value=barcode)' },
          { label: 'products (Search & Filter Products)', value: 'products', description: 'Search products catalog (optional search_terms)' },
          { label: 'categories (List Categories)', value: 'categories', description: 'List known product categories' },
          { label: 'category (Category Details)', value: 'category', description: 'Category identifier lookup (requires value)' },
          { label: 'brands (List Brands)', value: 'brands', description: 'List brands' },
          { label: 'brand (Brand Details)', value: 'brand', description: 'Brand identifier lookup (requires value)' },
          { label: 'countries (List Countries)', value: 'countries', description: 'List countries' },
          { label: 'ingredients (List Ingredients)', value: 'ingredients', description: 'List ingredients' },
          { label: 'ingredient (Ingredient Details)', value: 'ingredient', description: 'Ingredient identifier lookup (requires value)' },
          { label: 'additives (List Additives)', value: 'additives', description: 'List additives' },
          { label: 'additive (Additive Details)', value: 'additive', description: 'Additive identifier lookup (requires value)' },
          { label: 'allergens (List Allergens)', value: 'allergens', description: 'List allergens' },
          { label: 'allergen (Allergen Details)', value: 'allergen', description: 'Allergen identifier lookup (requires value)' },
          { label: 'labels (List Labels)', value: 'labels', description: 'List labels' },
          { label: 'label (Label Details)', value: 'label', description: 'Label identifier lookup (requires value)' },
          { label: 'packaging (List Packaging)', value: 'packaging', description: 'List packaging entries' },
          { label: 'packagingMaterial (Packaging Material Details)', value: 'packagingMaterial', description: 'Packaging material identifier lookup (requires value)' }
        ]
      },
      {
        name: 'value',
        label: 'Identifier (value)',
        type: 'string',
        required: false,
        placeholder: 'e.g. 737628064502 (barcode) or beverages (category)',
        description: 'Target identifier or barcode required for specific item lookup operations.'
      },
      {
        name: 'categories_tags_en',
        label: 'Category Tag (categories_tags_en)',
        type: 'string',
        required: false,
        placeholder: 'e.g. beverages, plant-based-foods-and-beverages, snacks',
        description: 'Category tag filter for products search (used with type=products).'
      },
      {
        name: 'search_terms',
        label: 'Search Terms',
        type: 'string',
        required: false,
        placeholder: 'e.g. milk, chocolate',
        description: 'Search keyword to filter products (used with type=products).'
      }
    ],
    presets: [
      {
        id: 'off-product-categories-search',
        label: 'Products by Category (beverages)',
        description: 'Search products by category tag (GET /open-food-facts?type=products&categories_tags_en=beverages)',
        queryParams: { type: 'products', categories_tags_en: 'beverages' }
      },
      {
        id: 'off-product-lookup',
        label: 'Product Lookup (737628064502)',
        description: 'Get product metadata by barcode (GET /open-food-facts?type=product&value=737628064502)',
        queryParams: { type: 'product', value: '737628064502' }
      },
      {
        id: 'off-product-search',
        label: 'Product Search (milk)',
        description: 'Search products catalog for milk (GET /open-food-facts?type=products&search_terms=milk)',
        queryParams: { type: 'products', search_terms: 'milk' }
      },
      {
        id: 'off-category',
        label: 'Category (beverages)',
        description: 'Get category details for beverages (GET /open-food-facts?type=category&value=beverages)',
        queryParams: { type: 'category', value: 'beverages' }
      },
      {
        id: 'off-brand',
        label: 'Brand (nestle)',
        description: 'Get brand details for Nestle (GET /open-food-facts?type=brand&value=nestle)',
        queryParams: { type: 'brand', value: 'nestle' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/open-food-facts?type=products&categories_tags_en=beverages',
    exampleCurl: 'curl "http://localhost:3000/open-food-facts?type=products&categories_tags_en=beverages"',
    responseExample: {
      code: '737628064502',
      product: {
        _id: '737628064502',
        product_name: 'Thai Peanut Noodle Kit',
        generic_name: 'Noodle Kit',
        brands: 'Simply Asia',
        categories: 'Plant-based foods and beverages, Plant-based foods, Cereals and potatoes, Meals, Noodle dishes',
        ingredients_text: 'Noodles: wheat flour, water, salt. Sauce: water, peanut butter, sugar, soy sauce, sesame oil, spices.',
        allergens: 'en:peanuts, en:soybeans, en:gluten',
        nutriments: {
          'energy-kcal_100g': 380,
          fat_100g: 12,
          carbohydrates_100g: 56,
          proteins_100g: 10,
          salt_100g: 1.8
        },
        nutriscore_grade: 'd',
        nova_group: 4,
        ecoscore_grade: 'b'
      },
      status: 1,
      status_verbose: 'product found'
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: "Missing required identifier 'value' for operation requiring an ID (such as product, category, brand, etc.).",
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: "Missing required 'value' parameter for type=product"
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[4],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 23. TheMealDB API
  {
    id: 'meal-db',
    category: 'meal-db',
    categoryTitle: 'TheMealDB',
    method: 'GET',
    path: '/meal-db',
    title: 'TheMealDB API',
    shortDescription: 'Provides meal, recipe, category, area, and ingredient data from TheMealDB.',
    description: 'The TheMealDB API provides meal, recipe, category, area, and ingredient data from TheMealDB database. Responses forward data directly from TheMealDB API v1 (https://www.themealdb.com/api/json/v1/1).',
    notes: [
      'Upstream API: https://www.themealdb.com/api/json/v1/1',
      'Response operation defaults to "random" (GET /meal-db).',
      'Operation "lookup" requires the "value" parameter (Meal ID).',
      'Operation "search" requires the "value" parameter (Meal Name).',
      'Operation "filter" requires at least one of "category", "area", or "ingredient".',
      'Operations "randomSelection", "categories", "areas", and "ingredients" require no additional parameters.',
      'The endpoint is read-only.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Operation Type',
        type: 'enum',
        required: false,
        defaultValue: 'random',
        description: 'TheMealDB operation type; defaults to random.',
        options: [
          { label: 'random (Get a random meal - default)', value: 'random', description: 'Get a random meal' },
          { label: 'randomSelection (Get a random selection of meals)', value: 'randomSelection', description: 'Get a random selection of meals' },
          { label: 'lookup (Get a meal by ID)', value: 'lookup', description: 'Get a meal by ID (requires value=id)' },
          { label: 'search (Search meals by name)', value: 'search', description: 'Search meals by name (requires value=name)' },
          { label: 'filter (Filter meals by category, area, or ingredient)', value: 'filter', description: 'Filter meals by category, area, or ingredient' },
          { label: 'categories (List meal categories)', value: 'categories', description: 'List meal categories' },
          { label: 'areas (List meal areas / cuisines)', value: 'areas', description: 'List meal areas/cuisines' },
          { label: 'ingredients (List meal ingredients)', value: 'ingredients', description: 'List meal ingredients' }
        ]
      },
      {
        name: 'value',
        label: 'Identifier / Query (value)',
        type: 'string',
        required: false,
        placeholder: 'e.g. 52772 (ID for lookup) or Arrabiata (Name for search)',
        description: 'Meal ID for lookup operation, or Meal Name for search operation.'
      },
      {
        name: 'category',
        label: 'Category',
        type: 'string',
        required: false,
        placeholder: 'e.g. Seafood, Beef, Vegetarian',
        description: 'Category filter for filter operation (used with type=filter).'
      },
      {
        name: 'area',
        label: 'Area / Cuisine',
        type: 'string',
        required: false,
        placeholder: 'e.g. Indian, Italian, Mexican',
        description: 'Area / Cuisine filter for filter operation (used with type=filter).'
      },
      {
        name: 'ingredient',
        label: 'Ingredient',
        type: 'string',
        required: false,
        placeholder: 'e.g. Chicken, Salmon, Garlic',
        description: 'Ingredient filter for filter operation (used with type=filter).'
      }
    ],
    presets: [
      {
        id: 'meal-preset-1-random',
        label: 'Preset 1 — Random Meal',
        description: 'Get a random meal (GET /meal-db)',
        queryParams: { type: 'random' }
      },
      {
        id: 'meal-preset-2-random-selection',
        label: 'Preset 2 — Random Selection',
        description: 'Get a random selection of meals (GET /meal-db?type=randomSelection)',
        queryParams: { type: 'randomSelection' }
      },
      {
        id: 'meal-preset-3-lookup',
        label: 'Preset 3 — Meal by ID (52772)',
        description: 'Lookup meal by ID (GET /meal-db?type=lookup&value=52772)',
        queryParams: { type: 'lookup', value: '52772' }
      },
      {
        id: 'meal-preset-4-search',
        label: 'Preset 4 — Search Meal (Arrabiata)',
        description: 'Search meals by name (GET /meal-db?type=search&value=Arrabiata)',
        queryParams: { type: 'search', value: 'Arrabiata' }
      },
      {
        id: 'meal-preset-5-filter-category',
        label: 'Preset 5 — Seafood Category',
        description: 'Filter meals by category (GET /meal-db?type=filter&category=Seafood)',
        queryParams: { type: 'filter', category: 'Seafood' }
      },
      {
        id: 'meal-preset-6-filter-area',
        label: 'Preset 6 — Indian Cuisine',
        description: 'Filter meals by area / cuisine (GET /meal-db?type=filter&area=Indian)',
        queryParams: { type: 'filter', area: 'Indian' }
      },
      {
        id: 'meal-preset-7-filter-ingredient',
        label: 'Preset 7 — Chicken Ingredient',
        description: 'Filter meals by main ingredient (GET /meal-db?type=filter&ingredient=Chicken)',
        queryParams: { type: 'filter', ingredient: 'Chicken' }
      },
      {
        id: 'meal-preset-8-categories',
        label: 'Preset 8 — Categories',
        description: 'List meal categories (GET /meal-db?type=categories)',
        queryParams: { type: 'categories' }
      },
      {
        id: 'meal-preset-9-areas',
        label: 'Preset 9 — Areas',
        description: 'List meal areas / cuisines (GET /meal-db?type=areas)',
        queryParams: { type: 'areas' }
      },
      {
        id: 'meal-preset-10-ingredients',
        label: 'Preset 10 — Ingredients',
        description: 'List meal ingredients (GET /meal-db?type=ingredients)',
        queryParams: { type: 'ingredients' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/meal-db',
    exampleCurl: 'curl http://localhost:3000/meal-db',
    responseExample: {
      meals: [
        {
          idMeal: '52772',
          strMeal: 'Teriyaki Chicken Casserole',
          strDrinkAlternate: null,
          strCategory: 'Chicken',
          strArea: 'Japanese',
          strInstructions: 'Preheat oven to 350° F. Spray a 9x13-inch baking dish with cooking spray. Combine soy sauce, mirin, brown sugar, garlic, and ginger in a small saucepan. Heat over medium heat until sugar is dissolved. In a large bowl, combine chicken, cooked rice, and broccoli florets. Pour sauce over chicken mixture and toss to coat evenly. Transfer to prepared baking dish and bake for 30 minutes until bubbling.',
          strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
          strTags: 'Meat,Casserole',
          strYoutube: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
          strIngredient1: 'soy sauce',
          strIngredient2: 'water',
          strIngredient3: 'brown sugar',
          strIngredient4: 'garlic',
          strIngredient5: 'ginger',
          strIngredient6: 'chicken breasts',
          strIngredient7: 'rice',
          strIngredient8: 'broccoli',
          strMeasure1: '3/4 cup',
          strMeasure2: '1/2 cup',
          strMeasure3: '1/4 cup',
          strMeasure4: '2 cloves',
          strMeasure5: '1 tbsp',
          strMeasure6: '2 pieces',
          strMeasure7: '2 cups',
          strMeasure8: '1 cup',
          strSource: 'https://findingtimeforcooking.com/main-dishes/casseroles/teriyaki-chicken-casserole/'
        }
      ]
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: "Missing required 'value' for lookup/search, missing filter parameters, or invalid operation type.",
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: "Missing required 'value' parameter for type=lookup"
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[4],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 24. TheCocktailDB API
  {
    id: 'cocktail-db',
    category: 'cocktail-db',
    categoryTitle: 'TheCocktailDB',
    method: 'GET',
    path: '/cocktail-db',
    title: 'TheCocktailDB API',
    shortDescription: 'Provides cocktail recipes, search, filters, categories, glass types, ingredients, and alcoholic classifications.',
    description: 'The TheCocktailDB API provides cocktail recipes, search, filters, categories, glass types, ingredients, and alcoholic classifications from TheCocktailDB database. Responses forward data directly from TheCocktailDB API v1 (https://www.thecocktaildb.com/api/json/v1/1).',
    notes: [
      'Upstream API: https://www.thecocktaildb.com/api/json/v1/1',
      'Response operation defaults to "random" (GET /cocktail-db).',
      'Operation "lookup" requires the "value" parameter (Cocktail ID, e.g. 11007).',
      'Operation "search" requires the "value" parameter (Cocktail Name, e.g. margarita).',
      'Operation "filter" requires at least one of "ingredient", "category", "alcoholic", or "glass".',
      'Operations "randomMultiple", "categories", "glass", "ingredients", and "alcoholic" require no additional parameters.',
      'The endpoint is read-only.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Operation Type',
        type: 'enum',
        required: false,
        defaultValue: 'random',
        description: 'TheCocktailDB operation type; defaults to random.',
        options: [
          { label: 'random (Random Cocktail - default)', value: 'random', description: 'Get a random cocktail' },
          { label: 'randomMultiple (Random Multiple Cocktails)', value: 'randomMultiple', description: 'Get a random selection of cocktails' },
          { label: 'lookup (Lookup Cocktail)', value: 'lookup', description: 'Get a cocktail by ID (requires value=id)' },
          { label: 'search (Search Cocktails)', value: 'search', description: 'Search cocktails by name (requires value=name)' },
          { label: 'filter (Filter Cocktails)', value: 'filter', description: 'Filter cocktails by ingredient, category, alcoholic type, or glass' },
          { label: 'categories (Categories)', value: 'categories', description: 'List cocktail categories' },
          { label: 'glass (Glass Types)', value: 'glass', description: 'List glass types' },
          { label: 'ingredients (Ingredients)', value: 'ingredients', description: 'List cocktail ingredients' },
          { label: 'alcoholic (Alcoholic Classifications)', value: 'alcoholic', description: 'List alcoholic classifications' }
        ]
      },
      {
        name: 'value',
        label: 'Identifier / Query (value)',
        type: 'string',
        required: false,
        placeholder: 'e.g. 11007 (Cocktail ID) or margarita (Cocktail Name)',
        description: 'Cocktail ID for lookup operation, or Cocktail Name for search operation.'
      },
      {
        name: 'ingredient',
        label: 'Ingredient',
        type: 'string',
        required: false,
        placeholder: 'e.g. Gin, Vodka, Tequila',
        description: 'Ingredient filter for filter operation (used with type=filter).'
      },
      {
        name: 'category',
        label: 'Category',
        type: 'string',
        required: false,
        placeholder: 'e.g. Cocktail, Ordinary Drink, Shot',
        description: 'Category filter for filter operation (used with type=filter).'
      },
      {
        name: 'alcoholic',
        label: 'Alcoholic Classification',
        type: 'string',
        required: false,
        placeholder: 'e.g. Alcoholic, Non_Alcoholic, Optional alcohol',
        description: 'Alcoholic classification filter for filter operation (used with type=filter).'
      },
      {
        name: 'glass',
        label: 'Glass Type',
        type: 'string',
        required: false,
        placeholder: 'e.g. Cocktail_glass, Highball_glass, Champagne_flute',
        description: 'Glass type filter for filter operation (used with type=filter).'
      }
    ],
    presets: [
      {
        id: 'cocktail-preset-1-random',
        label: 'Preset 1 — Random Cocktail',
        description: 'Get a random cocktail (GET /cocktail-db)',
        queryParams: { type: 'random' }
      },
      {
        id: 'cocktail-preset-2-random-multiple',
        label: 'Preset 2 — Random Multiple Cocktails',
        description: 'Get a random selection of cocktails (GET /cocktail-db?type=randomMultiple)',
        queryParams: { type: 'randomMultiple' }
      },
      {
        id: 'cocktail-preset-3-lookup',
        label: 'Preset 3 — Lookup Cocktail (11007)',
        description: 'Lookup cocktail by ID (GET /cocktail-db?type=lookup&value=11007)',
        queryParams: { type: 'lookup', value: '11007' }
      },
      {
        id: 'cocktail-preset-4-search',
        label: 'Preset 4 — Search Cocktails (margarita)',
        description: 'Search cocktails by name (GET /cocktail-db?type=search&value=margarita)',
        queryParams: { type: 'search', value: 'margarita' }
      },
      {
        id: 'cocktail-preset-5-filter-ingredient',
        label: 'Preset 5 — Filter by Ingredient (Gin)',
        description: 'Filter cocktails by ingredient (GET /cocktail-db?type=filter&ingredient=Gin)',
        queryParams: { type: 'filter', ingredient: 'Gin' }
      },
      {
        id: 'cocktail-preset-6-filter-category',
        label: 'Preset 6 — Filter by Category (Cocktail)',
        description: 'Filter cocktails by category (GET /cocktail-db?type=filter&category=Cocktail)',
        queryParams: { type: 'filter', category: 'Cocktail' }
      },
      {
        id: 'cocktail-preset-7-filter-alcoholic',
        label: 'Preset 7 — Filter by Alcoholic (Alcoholic)',
        description: 'Filter cocktails by classification (GET /cocktail-db?type=filter&alcoholic=Alcoholic)',
        queryParams: { type: 'filter', alcoholic: 'Alcoholic' }
      },
      {
        id: 'cocktail-preset-8-filter-glass',
        label: 'Preset 8 — Filter by Glass (Cocktail_glass)',
        description: 'Filter cocktails by glass type (GET /cocktail-db?type=filter&glass=Cocktail_glass)',
        queryParams: { type: 'filter', glass: 'Cocktail_glass' }
      },
      {
        id: 'cocktail-preset-9-categories',
        label: 'Preset 9 — Categories',
        description: 'List cocktail categories (GET /cocktail-db?type=categories)',
        queryParams: { type: 'categories' }
      },
      {
        id: 'cocktail-preset-10-glass',
        label: 'Preset 10 — Glass Types',
        description: 'List glass types (GET /cocktail-db?type=glass)',
        queryParams: { type: 'glass' }
      },
      {
        id: 'cocktail-preset-11-ingredients',
        label: 'Preset 11 — Ingredients',
        description: 'List cocktail ingredients (GET /cocktail-db?type=ingredients)',
        queryParams: { type: 'ingredients' }
      },
      {
        id: 'cocktail-preset-12-alcoholic',
        label: 'Preset 12 — Alcoholic Classifications',
        description: 'List alcoholic classifications (GET /cocktail-db?type=alcoholic)',
        queryParams: { type: 'alcoholic' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/cocktail-db',
    exampleCurl: 'curl http://localhost:3000/cocktail-db',
    responseExample: {
      drinks: [
        {
          idDrink: '11007',
          strDrink: 'Margarita',
          strDrinkAlternate: null,
          strTags: 'IBA,ContemporaryClassic',
          strVideo: null,
          strCategory: 'Ordinary Drink',
          strIBA: 'Contemporary Classics',
          strAlcoholic: 'Alcoholic',
          strGlass: 'Cocktail glass',
          strInstructions: 'Rub the rim of the glass with the lime slice to make the salt stick to it. Take care to moisten only the outer rim and sprinkle the salt on it. The salt should present to the lips of the imbiber and never mix into the cocktail. Shake the other ingredients with ice, then carefully pour into the glass.',
          strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg',
          strIngredient1: 'Tequila',
          strIngredient2: 'Triple sec',
          strIngredient3: 'Lime juice',
          strIngredient4: 'Salt',
          strMeasure1: '1 1/2 oz',
          strMeasure2: '1/2 oz',
          strMeasure3: '1 oz',
          strMeasure4: null
        }
      ]
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: "Missing required 'value' for lookup/search, missing filter parameters, or invalid operation type.",
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: "Missing required 'value' parameter for type=lookup"
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[4],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 25. JokeAPI
  {
    id: 'joke-api',
    category: 'joke-api',
    categoryTitle: 'JokeAPI',
    method: 'GET',
    path: '/joke-api',
    title: 'JokeAPI',
    shortDescription: 'Provides access to random jokes, category-specific jokes, joke IDs, and filtered joke results.',
    description: 'The JokeAPI provides access to random jokes, category-specific jokes, and filtered joke results from the JokeAPI v2 service (https://v2.jokeapi.dev).',
    notes: [
      'Upstream API: https://v2.jokeapi.dev',
      'Response operation defaults to "random" (GET /joke-api).',
      'Operation "joke" requires the "value" parameter (Joke ID, e.g. 123).',
      'Operations "category", "categories", and "filter" require the "value" parameter (Category or comma-separated categories).',
      'The "filter" operation supports optional blacklistFlags (comma-separated, e.g. nsfw,religious,political) and safe (true/false).',
      'Amount controls the number of jokes returned (e.g. amount=5).',
      'Joke format (single / twopart) can be specified via format (mapped to JokeAPI format type parameter).',
      'The endpoint is read-only.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Operation Type',
        type: 'enum',
        required: false,
        defaultValue: 'random',
        description: 'JokeAPI local operation selector; defaults to random.',
        options: [
          { label: 'random (Random Joke - default)', value: 'random', description: 'Get a random joke' },
          { label: 'joke (Joke by ID)', value: 'joke', description: 'Get a joke by ID (requires value=id)' },
          { label: 'category (Joke by Category)', value: 'category', description: 'Get jokes from a specific category (requires value=category)' },
          { label: 'categories (Multiple Categories)', value: 'categories', description: 'Get jokes from one or more categories (requires value=cat1,cat2)' },
          { label: 'filter (Filter Jokes)', value: 'filter', description: 'Get jokes from a category with additional filters (requires value=category)' }
        ]
      },
      {
        name: 'value',
        label: 'Category or Joke ID (value)',
        type: 'string',
        required: false,
        placeholder: 'e.g. Programming, or 123 (for joke by ID)',
        description: 'Category for random, category, or filter; Joke ID for joke operation; comma-separated categories for categories operation.'
      },
      {
        name: 'amount',
        label: 'Amount',
        type: 'number',
        required: false,
        placeholder: 'e.g. 5',
        description: 'Number of jokes to return (e.g. 5).'
      },
      {
        name: 'format',
        label: 'Joke Format',
        type: 'enum',
        required: false,
        defaultValue: '',
        description: 'JokeAPI joke format: single (one-liner) or twopart (setup + delivery).',
        options: [
          { label: '(Any / Both)', value: '', description: 'Default format (both single and twopart jokes)' },
          { label: 'single (Single)', value: 'single', description: 'Single one-liner joke' },
          { label: 'twopart (Two Part)', value: 'twopart', description: 'Two-part joke with setup and delivery' }
        ]
      },
      {
        name: 'blacklistFlags',
        label: 'Blacklist Flags',
        type: 'string',
        required: false,
        placeholder: 'e.g. nsfw,religious,political,racist,sexist,explicit',
        description: 'Comma-separated flags to exclude from results.'
      },
      {
        name: 'safe',
        label: 'Safe for Work (safe)',
        type: 'enum',
        required: false,
        defaultValue: '',
        description: 'Request safe-for-work jokes (safe=true).',
        options: [
          { label: '(Default / Unspecified)', value: '', description: 'Default safety filter' },
          { label: 'true (Safe for Work)', value: 'true', description: 'Filter out unsafe jokes' },
          { label: 'false (Allow All)', value: 'false', description: 'Do not enforce safe mode' }
        ]
      },
      {
        name: 'lang',
        label: 'Language (lang)',
        type: 'string',
        required: false,
        placeholder: 'e.g. en, de, es, fr, cs, pt',
        description: 'Language code for jokes (defaults to en).'
      }
    ],
    presets: [
      {
        id: 'joke-preset-1-random',
        label: 'Preset 1 — Random Joke',
        description: 'Get a random joke (GET /joke-api)',
        queryParams: { type: 'random' }
      },
      {
        id: 'joke-preset-2-programming',
        label: 'Preset 2 — Programming Joke',
        description: 'Get a random Programming joke (GET /joke-api?type=random&value=Programming)',
        queryParams: { type: 'random', value: 'Programming' }
      },
      {
        id: 'joke-preset-3-category',
        label: 'Preset 3 — Joke by Category (Programming)',
        description: 'Get jokes from category Programming (GET /joke-api?type=category&value=Programming)',
        queryParams: { type: 'category', value: 'Programming' }
      },
      {
        id: 'joke-preset-4-categories',
        label: 'Preset 4 — Multiple Categories (Programming,Misc)',
        description: 'Get jokes from multiple categories (GET /joke-api?type=categories&value=Programming,Misc)',
        queryParams: { type: 'categories', value: 'Programming,Misc' }
      },
      {
        id: 'joke-preset-5-filter',
        label: 'Preset 5 — Filtered Joke (Safe & Blacklist)',
        description: 'Get filtered joke (GET /joke-api?type=filter&value=Programming&blacklistFlags=nsfw,religious,political&safe=true)',
        queryParams: { type: 'filter', value: 'Programming', blacklistFlags: 'nsfw,religious,political', safe: 'true' }
      },
      {
        id: 'joke-preset-6-multiple',
        label: 'Preset 6 — Multiple Jokes (Amount 5, Single)',
        description: 'Get 5 single-format jokes (GET /joke-api?type=random&value=Programming&amount=5&format=single)',
        queryParams: { type: 'random', value: 'Programming', amount: '5', format: 'single' }
      },
      {
        id: 'joke-preset-7-by-id',
        label: 'Preset 7 — Joke by ID (123)',
        description: 'Get joke by specific ID (GET /joke-api?type=joke&value=123)',
        queryParams: { type: 'joke', value: '123' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/joke-api',
    exampleCurl: 'curl http://localhost:3000/joke-api',
    responseExample: {
      error: false,
      category: 'Programming',
      type: 'twopart',
      setup: 'Why did the programmer quit his job?',
      delivery: "Because he didn't get arrays.",
      flags: {
        nsfw: false,
        religious: false,
        political: false,
        racist: false,
        sexist: false,
        explicit: false
      },
      id: 123,
      safe: true,
      lang: 'en'
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: "Missing required 'value' for joke ID, category, or filter operation, or invalid operation type.",
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: "Missing required 'value' parameter for type=joke"
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[4],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 26. Official Joke API
  {
    id: 'official-joke',
    category: 'official-joke',
    categoryTitle: 'Official Joke API',
    method: 'GET',
    path: '/official-joke',
    title: 'Official Joke API',
    shortDescription: 'Provides random jokes, joke collections, joke types, type-specific jokes, and jokes by ID.',
    description: 'The Official Joke API provides random jokes, joke collections, joke types, type-specific jokes, and jokes by ID from the Official Joke API service (https://official-joke-api.appspot.com).',
    notes: [
      'Upstream API: https://official-joke-api.appspot.com',
      'Response operation defaults to "random" (GET /official-joke -> /random_joke).',
      'Operation "randomTen" fetches 10 random jokes (GET /official-joke?type=randomTen -> /random_ten).',
      'Operation "ten" fetches 10 jokes (GET /official-joke?type=ten -> /jokes/ten).',
      'Operation "randomMultiple" requires a positive integer count in the "value" parameter (GET /official-joke?type=randomMultiple&value=5 -> /jokes/random/5).',
      'Operation "types" fetches all available joke types (GET /official-joke?type=types -> /types).',
      'Operation "byType" requires "value" (joke type, e.g. programming) and supports optional "mode" (random / ten) (GET /official-joke?type=byType&value=programming -> /jokes/programming/random).',
      'Operation "joke" requires "value" (joke ID, e.g. 1) (GET /official-joke?type=joke&value=1 -> /jokes/1).',
      'The endpoint is read-only.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Operation Type',
        type: 'enum',
        required: false,
        defaultValue: 'random',
        description: 'Official Joke API operation selector; defaults to random.',
        options: [
          { label: 'Random Joke (default)', value: 'random', description: 'Get a single random joke (/random_joke)' },
          { label: 'Random Ten', value: 'randomTen', description: 'Get ten random jokes (/random_ten)' },
          { label: 'Ten Jokes', value: 'ten', description: 'Get ten jokes (/jokes/ten)' },
          { label: 'Random Multiple', value: 'randomMultiple', description: 'Get multiple random jokes by count (/jokes/random/{count})' },
          { label: 'Joke Types', value: 'types', description: 'Get all available joke categories/types (/types)' },
          { label: 'Joke by Type', value: 'byType', description: 'Get jokes by type with mode random/ten (/jokes/{type}/random or /jokes/{type}/ten)' },
          { label: 'Joke by ID', value: 'joke', description: 'Get a specific joke by ID (/jokes/{id})' }
        ]
      },
      {
        name: 'value',
        label: 'Value (ID, Type, or Count)',
        type: 'string',
        required: false,
        placeholder: 'e.g. 5, programming, or 1',
        description: 'Joke ID for joke, Joke Type for byType, or Count (positive integer) for randomMultiple.'
      },
      {
        name: 'mode',
        label: 'Mode (for byType)',
        type: 'enum',
        required: false,
        defaultValue: 'random',
        description: 'Mode for byType operation: random (single joke) or ten (10 jokes).',
        options: [
          { label: 'random (Random Joke of Type)', value: 'random', description: 'Get a single random joke of this type' },
          { label: 'ten (Ten Jokes of Type)', value: 'ten', description: 'Get 10 jokes of this type' }
        ]
      }
    ],
    presets: [
      {
        id: 'official-joke-preset-1-random',
        label: 'Preset 1 — Random Joke',
        description: 'Get a single random joke (GET /official-joke)',
        queryParams: { type: 'random' }
      },
      {
        id: 'official-joke-preset-2-random-ten',
        label: 'Preset 2 — Ten Random Jokes',
        description: 'Get ten random jokes (GET /official-joke?type=randomTen)',
        queryParams: { type: 'randomTen' }
      },
      {
        id: 'official-joke-preset-3-ten',
        label: 'Preset 3 — Ten Jokes',
        description: 'Get ten jokes (GET /official-joke?type=ten)',
        queryParams: { type: 'ten' }
      },
      {
        id: 'official-joke-preset-4-multiple',
        label: 'Preset 4 — Five Random Jokes',
        description: 'Get 5 random jokes (GET /official-joke?type=randomMultiple&value=5)',
        queryParams: { type: 'randomMultiple', value: '5' }
      },
      {
        id: 'official-joke-preset-5-types',
        label: 'Preset 5 — Joke Types',
        description: 'Get all available joke types (GET /official-joke?type=types)',
        queryParams: { type: 'types' }
      },
      {
        id: 'official-joke-preset-6-by-type',
        label: 'Preset 6 — Programming Joke',
        description: 'Get a random programming joke (GET /official-joke?type=byType&value=programming)',
        queryParams: { type: 'byType', value: 'programming', mode: 'random' }
      },
      {
        id: 'official-joke-preset-7-by-type-ten',
        label: 'Preset 7 — Ten Programming Jokes',
        description: 'Get ten programming jokes (GET /official-joke?type=byType&value=programming&mode=ten)',
        queryParams: { type: 'byType', value: 'programming', mode: 'ten' }
      },
      {
        id: 'official-joke-preset-8-by-id',
        label: 'Preset 8 — Joke by ID (1)',
        description: 'Get joke by ID 1 (GET /official-joke?type=joke&value=1)',
        queryParams: { type: 'joke', value: '1' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/official-joke',
    exampleCurl: 'curl http://localhost:3000/official-joke',
    responseExample: {
      type: 'general',
      setup: 'What do you call a factory that makes okay products?',
      punchline: 'A satisfactory.',
      id: 1
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: "Missing required 'value' for joke ID, type, or randomMultiple count, or count is not a positive integer.",
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: "Count must be a positive integer for type=randomMultiple"
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[4],
      COMMON_STATUS_CODES[5]
    ]
  },

  // 27. Random User API
  {
    id: 'random-user',
    category: 'random-user',
    categoryTitle: 'Random User API',
    method: 'GET',
    path: '/random-user',
    title: 'Random User API',
    shortDescription: 'Provides randomly generated user profiles with support for filtering, fields, seeds, and pagination.',
    description: 'The Random User API provides randomly generated user profiles with support for filtering by gender, nationality, selected fields, exclusions, seeds, pagination, and result count from Random User Generator (https://randomuser.me/api).',
    notes: [
      'Upstream API: https://randomuser.me/api',
      'Supported operation: "random" (defaults to "random", upstream path /).',
      'All query parameters other than the local "type" parameter are forwarded to the Random User API.',
      'Results parameter accepts a positive integer count of user profiles to generate.',
      'Gender filter supports "male" or "female". Omit or select "Any" for both.',
      'Nationality (nat) supports comma-separated nationality codes (e.g. "in", "us", "gb").',
      'Seed allows generating consistent reproducible user data.',
      'Page parameter is used for pagination when a seed is provided.',
      'Include fields (inc) and exclude fields (exc) accept comma-separated field names.',
      'No Info (noinfo) excludes the "info" metadata object from the response when set to true.',
      'The endpoint is read-only.'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'type',
        label: 'Operation Type',
        type: 'enum',
        required: false,
        defaultValue: 'random',
        description: 'Operation selector; defaults to random.',
        options: [
          { label: 'Random Users (default)', value: 'random', description: 'Generate random user profiles (/)' }
        ]
      },
      {
        name: 'results',
        label: 'Results (Count)',
        type: 'string',
        required: false,
        placeholder: 'e.g. 10',
        description: 'Number of user profiles to return (positive integer).'
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'enum',
        required: false,
        defaultValue: '',
        description: 'Filter generated users by gender.',
        options: [
          { label: 'Any (default)', value: '', description: 'Any gender' },
          { label: 'Male', value: 'male', description: 'Only male profiles' },
          { label: 'Female', value: 'female', description: 'Only female profiles' }
        ]
      },
      {
        name: 'nat',
        label: 'Nationality',
        type: 'string',
        required: false,
        placeholder: 'e.g. in or in,us,gb',
        description: 'Comma-separated nationality codes (e.g. in, us, gb).'
      },
      {
        name: 'seed',
        label: 'Seed',
        type: 'string',
        required: false,
        placeholder: 'e.g. foobar',
        description: 'Seed string for deterministic/reproducible results.'
      },
      {
        name: 'page',
        label: 'Page',
        type: 'string',
        required: false,
        placeholder: 'e.g. 2',
        description: 'Page number for paginating seeded results (positive integer).'
      },
      {
        name: 'inc',
        label: 'Include Fields',
        type: 'string',
        required: false,
        placeholder: 'e.g. name,email,picture',
        description: 'Comma-separated list of fields to include in the output.'
      },
      {
        name: 'exc',
        label: 'Exclude Fields',
        type: 'string',
        required: false,
        placeholder: 'e.g. login',
        description: 'Comma-separated list of fields to exclude from the output.'
      },
      {
        name: 'format',
        label: 'Format',
        type: 'string',
        required: false,
        placeholder: 'e.g. json, csv, yaml, xml',
        description: 'Response format.'
      },
      {
        name: 'noinfo',
        label: 'No Info',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Exclude the "info" metadata object from the response (noinfo=true).'
      }
    ],
    presets: [
      {
        id: 'random-user-preset-1-default',
        label: 'Preset 1 — Random User',
        description: 'Get a single random user profile (GET /random-user)',
        queryParams: { type: 'random' }
      },
      {
        id: 'random-user-preset-2-multiple',
        label: 'Preset 2 — Multiple Users (10)',
        description: 'Get 10 random users (GET /random-user?results=10)',
        queryParams: { results: '10' }
      },
      {
        id: 'random-user-preset-3-male',
        label: 'Preset 3 — Male Users',
        description: 'Get male user profile (GET /random-user?gender=male)',
        queryParams: { gender: 'male' }
      },
      {
        id: 'random-user-preset-4-female',
        label: 'Preset 4 — Female Users',
        description: 'Get female user profile (GET /random-user?gender=female)',
        queryParams: { gender: 'female' }
      },
      {
        id: 'random-user-preset-5-nat-in',
        label: 'Preset 5 — Indian Users',
        description: 'Get user from India (GET /random-user?nat=in)',
        queryParams: { nat: 'in' }
      },
      {
        id: 'random-user-preset-6-nat-in-10',
        label: 'Preset 6 — Indian Users — 10 Results',
        description: 'Get 10 users from India (GET /random-user?results=10&nat=in)',
        queryParams: { results: '10', nat: 'in' }
      },
      {
        id: 'random-user-preset-7-inc',
        label: 'Preset 7 — Selected Fields',
        description: 'Get users with only name, email, picture (GET /random-user?results=10&inc=name,email,picture)',
        queryParams: { results: '10', inc: 'name,email,picture' }
      },
      {
        id: 'random-user-preset-8-exc',
        label: 'Preset 8 — Exclude Login',
        description: 'Get users excluding login info (GET /random-user?results=10&exc=login)',
        queryParams: { results: '10', exc: 'login' }
      },
      {
        id: 'random-user-preset-9-seed',
        label: 'Preset 9 — Seeded Results',
        description: 'Get deterministic users using seed "foobar" (GET /random-user?results=10&seed=foobar)',
        queryParams: { results: '10', seed: 'foobar' }
      },
      {
        id: 'random-user-preset-10-seed-page',
        label: 'Preset 10 — Seeded Page',
        description: 'Get page 2 of seed "foobar" (GET /random-user?results=10&page=2&seed=foobar)',
        queryParams: { results: '10', page: '2', seed: 'foobar' }
      }
    ],
    exampleRequestUrl: 'https://free-api-server.vercel.app/random-user',
    exampleCurl: 'curl http://localhost:3000/random-user',
    responseExample: {
      results: [
        {
          gender: 'female',
          name: {
            title: 'Miss',
            first: 'Jennie',
            last: 'Nichols'
          },
          location: {
            street: {
              number: 8929,
              name: 'Valwood Pkwy'
            },
            city: 'Billings',
            state: 'Michigan',
            country: 'United States',
            postcode: 63104
          },
          email: 'jennie.nichols@example.com',
          phone: '(272) 790-0888',
          picture: {
            large: 'https://randomuser.me/api/portraits/women/75.jpg',
            medium: 'https://randomuser.me/api/portraits/med/women/75.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/women/75.jpg'
          },
          nat: 'US'
        }
      ],
      info: {
        seed: 'foobar',
        results: 1,
        page: 1,
        version: '1.4'
      }
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: 'Invalid operation type, or results/page is not a positive integer.',
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: 'results must be a positive integer'
        }
      },
      COMMON_STATUS_CODES[2],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[4],
      COMMON_STATUS_CODES[5]
    ]
  },
  {
    id: 'bored',
    category: 'bored',
    categoryTitle: 'Bored API',
    method: 'GET',
    path: '/bored',
    title: 'Bored Activities',
    shortDescription: 'Discover random activities or filter by type, participants, and activity key.',
    description: 'Provides access to random activities and supports filtering activities by type and number of participants, as well as retrieving an activity by key from Bored API (https://bored-api.appbrewery.com).',
    notes: [
      'Local selector: operation (random, filter, activity). Defaults to random (/random).',
      'Parameter distinction: "operation" selects the local operation mode, while "type" is the upstream activity type filter (e.g. education, social, recreational).',
      'The "activity" operation requires an Activity Key passed via the "value" parameter (upstream: /activity/{key}).',
      'Upstream API base: https://bored-api.appbrewery.com'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'operation',
        type: 'string',
        required: false,
        defaultValue: 'random',
        description: 'Operation type: random, filter, or activity. Defaults to random.',
        options: [
          { label: 'random — Random Activity', value: 'random' },
          { label: 'filter — Filter Activities', value: 'filter' },
          { label: 'activity — Activity by Key', value: 'activity' }
        ]
      },
      {
        name: 'type',
        type: 'string',
        required: false,
        placeholder: 'e.g. education, social, recreational',
        description: 'Activity type filter (used with operation=filter). Supported: education, recreational, social, diy, charity, cooking, relaxation, music, busywork.'
      },
      {
        name: 'participants',
        type: 'number',
        required: false,
        placeholder: 'e.g. 2',
        description: 'Number of participants filter (used with operation=filter).'
      },
      {
        name: 'value',
        type: 'string',
        required: false,
        placeholder: 'e.g. 3943506',
        description: 'Activity Key (required when operation=activity).'
      }
    ],
    presets: [
      {
        id: 'random',
        label: 'Random Activity',
        description: 'Get a random activity suggestion',
        queryParams: { operation: 'random' }
      },
      {
        id: 'filter-education',
        label: 'Educational Activity',
        description: 'Filter activities by type "education"',
        queryParams: { operation: 'filter', type: 'education' }
      },
      {
        id: 'filter-participants',
        label: 'Two Participants',
        description: 'Filter activities requiring 2 participants',
        queryParams: { operation: 'filter', participants: '2' }
      },
      {
        id: 'filter-social-two',
        label: 'Social Activity for Two',
        description: 'Filter social activities for 2 participants',
        queryParams: { operation: 'filter', type: 'social', participants: '2' }
      },
      {
        id: 'activity-key',
        label: 'Activity by Key',
        description: 'Retrieve a specific activity by its key',
        queryParams: { operation: 'activity', value: '3943506' }
      }
    ],
    exampleRequestUrl: '/bored',
    exampleCurl: 'curl http://localhost:3000/bored',
    responseExample: {
      activity: 'Learn Express.js',
      availability: 0.25,
      type: 'education',
      participants: 1,
      price: 0.1,
      accessibility: 'Few to no challenges',
      duration: 'hours',
      kidFriendly: true,
      link: 'https://expressjs.com/',
      key: '3943506'
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: 'Invalid operation type, missing activity key, or invalid parameter values.',
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: 'value is required for activity operation'
        }
      },
      COMMON_STATUS_CODES[1],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[4],
      COMMON_STATUS_CODES[5]
    ]
  },
  {
    id: 'deck-of-cards',
    category: 'deck-of-cards',
    categoryTitle: 'Deck of Cards API',
    method: 'GET',
    path: '/deck-of-cards',
    title: 'Deck of Cards Operations',
    shortDescription: 'Create decks, shuffle cards, draw cards, and manage named card piles.',
    description: 'Provides operations for creating new decks, shuffling cards, drawing cards, and managing named piles from upstream Deck of Cards API (https://deckofcardsapi.com/api/deck).',
    notes: [
      'Local selector: operation (new, newShuffle, draw, shuffle, return, pileAdd, pileShuffle, pileList, pileDraw, pileReturn). Defaults to newShuffle (/new/shuffle/).',
      'Operations working with an existing deck (draw, shuffle, return) require "deckId".',
      'Pile operations (pileAdd, pileShuffle, pileList, pileDraw, pileReturn) require both "deckId" and "pileName".',
      'Card lists use standard comma-separated card codes: AS, 2S, KH, etc.',
      'Upstream API base: https://deckofcardsapi.com/api/deck'
    ],
    pathParams: [],
    queryParams: [
      {
        name: 'operation',
        type: 'string',
        required: false,
        defaultValue: 'newShuffle',
        description: 'Deck of Cards operation. Defaults to newShuffle.',
        options: [
          { label: 'newShuffle — New Shuffled Deck', value: 'newShuffle' },
          { label: 'new — New Unshuffled Deck', value: 'new' },
          { label: 'draw — Draw Cards from Deck', value: 'draw' },
          { label: 'shuffle — Reshuffle Existing Deck', value: 'shuffle' },
          { label: 'return — Return Cards to Deck', value: 'return' },
          { label: 'pileAdd — Add Cards to Pile', value: 'pileAdd' },
          { label: 'pileShuffle — Shuffle Pile', value: 'pileShuffle' },
          { label: 'pileList — List Cards in Pile', value: 'pileList' },
          { label: 'pileDraw — Draw Cards from Pile', value: 'pileDraw' },
          { label: 'pileReturn — Return Pile to Deck', value: 'pileReturn' }
        ]
      },
      {
        name: 'deckId',
        type: 'string',
        required: false,
        placeholder: 'e.g. 3p40paa87x90',
        description: 'Existing Deck ID (required for draw, shuffle, return, and all pile operations).'
      },
      {
        name: 'pileName',
        type: 'string',
        required: false,
        placeholder: 'e.g. discard',
        description: 'Named pile identifier (required for pileAdd, pileShuffle, pileList, pileDraw, and pileReturn).'
      },
      {
        name: 'count',
        type: 'number',
        required: false,
        placeholder: 'e.g. 2',
        description: 'Number of cards to draw (used with draw and pileDraw).'
      },
      {
        name: 'deckCount',
        type: 'number',
        required: false,
        placeholder: 'e.g. 1',
        description: 'Number of decks to create (used with new and newShuffle).'
      },
      {
        name: 'jokersEnabled',
        type: 'boolean',
        required: false,
        description: 'Whether to include 2 jokers in a new deck (used with new and newShuffle).',
        options: [
          { label: 'false (Standard 52 cards)', value: 'false' },
          { label: 'true (Include 2 Jokers)', value: 'true' }
        ]
      },
      {
        name: 'cards',
        type: 'string',
        required: false,
        placeholder: 'e.g. AS,2S',
        description: 'Comma-separated card codes (used with return and pileAdd).'
      },
      {
        name: 'remaining',
        type: 'boolean',
        required: false,
        description: 'Shuffle only remaining cards when true (used with shuffle).',
        options: [
          { label: 'false (Shuffle all cards)', value: 'false' },
          { label: 'true (Shuffle only remaining)', value: 'true' }
        ]
      }
    ],
    presets: [
      {
        id: 'new-deck',
        label: 'New Deck',
        description: 'Create a new unshuffled deck',
        queryParams: { operation: 'new' }
      },
      {
        id: 'new-shuffled-deck',
        label: 'New Shuffled Deck',
        description: 'Create and shuffle a new deck with deckCount=1',
        queryParams: { operation: 'newShuffle', deckCount: '1' }
      },
      {
        id: 'draw-cards',
        label: 'Draw Cards',
        description: 'Draw 2 cards from an existing deck',
        queryParams: { operation: 'draw', deckId: '3p40paa87x90', count: '2' }
      },
      {
        id: 'shuffle-existing',
        label: 'Shuffle Existing Deck',
        description: 'Reshuffle remaining cards in an existing deck',
        queryParams: { operation: 'shuffle', deckId: '3p40paa87x90', remaining: 'true' }
      },
      {
        id: 'add-to-pile',
        label: 'Add Cards to Pile',
        description: 'Add AS,2S to the "discard" pile',
        queryParams: { operation: 'pileAdd', deckId: '3p40paa87x90', pileName: 'discard', cards: 'AS,2S' }
      },
      {
        id: 'list-pile',
        label: 'List Pile',
        description: 'List cards currently in the "discard" pile',
        queryParams: { operation: 'pileList', deckId: '3p40paa87x90', pileName: 'discard' }
      },
      {
        id: 'draw-from-pile',
        label: 'Draw From Pile',
        description: 'Draw 2 cards from the "discard" pile',
        queryParams: { operation: 'pileDraw', deckId: '3p40paa87x90', pileName: 'discard', count: '2' }
      }
    ],
    exampleRequestUrl: '/deck-of-cards',
    exampleCurl: 'curl http://localhost:3000/deck-of-cards',
    responseExample: {
      success: true,
      deck_id: '3p40paa87x90',
      remaining: 52,
      shuffled: true
    },
    statusCodes: [
      COMMON_STATUS_CODES[0],
      {
        code: 400,
        title: 'Bad Request',
        description: 'Invalid operation, missing deckId / pileName, or malformed parameters.',
        responseExample: {
          success: false,
          statusCode: 400,
          status: false,
          message: 'deckId is required for operation draw'
        }
      },
      COMMON_STATUS_CODES[1],
      COMMON_STATUS_CODES[3],
      COMMON_STATUS_CODES[4],
      COMMON_STATUS_CODES[5]
    ]
  }
];

export function getEndpointById(id: string): EndpointDefinition | undefined {
  return API_ENDPOINTS.find(e => e.id === id);
}
