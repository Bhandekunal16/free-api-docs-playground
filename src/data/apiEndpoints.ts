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
  }
];

export function getEndpointById(id: string): EndpointDefinition | undefined {
  return API_ENDPOINTS.find(e => e.id === id);
}
