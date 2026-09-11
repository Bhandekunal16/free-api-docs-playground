export interface DocArticle {
  id: string;
  title: string;
  category: 'guide' | 'reference';
  shortDescription: string;
  icon: string;
  sections: {
    heading: string;
    content: string;
    subsections?: {
      title: string;
      body: string;
      codeBlock?: {
        language: string;
        code: string;
      };
    }[];
  }[];
}

export const DOC_ARTICLES: Record<string, DocArticle> = {
  overview: {
    id: 'overview',
    title: 'API Overview & Quickstart',
    category: 'guide',
    shortDescription: 'Comprehensive developer guide for the Free API Server with live endpoint testing, base URL configuration, and architecture.',
    icon: 'BookOpen',
    sections: [
      {
        heading: 'Welcome to Free API Server',
        content: 'Free API Server is a high-performance, developer-friendly mock backend and utility service designed for frontend prototyping, testing, mobile app development, and documentation playgrounds. All endpoints are open, read-only GET endpoints requiring zero API keys or authentication credentials.'
      },
      {
        heading: 'Key Features & Capabilities',
        content: 'Explore mock collections, realistic relational fake data, world country lookups, and global weather forecasting directly from your browser or backend applications.',
        subsections: [
          {
            title: 'Zero Authentication Needed',
            body: 'Jump straight into development without registering for API keys, bearer tokens, or OAuth applications.'
          },
          {
            title: 'Fast & Hosted on Edge',
            body: 'Hosted at https://free-api-server.vercel.app with ultra-low latency, CORS enabled for all origins (*), and high uptime.'
          },
          {
            title: 'Rich & Versatile Datasets',
            body: 'From lightweight placeholder data (posts, users, comments) to complex paginated e-commerce schemas, country demographics, and live WMO weather models.'
          }
        ]
      },
      {
        heading: 'Base URL Configuration',
        content: 'The default production endpoint is hosted at https://free-api-server.vercel.app/. You can customize the Base URL in the top bar to point to your own custom proxy or deployed mirror if needed.',
        subsections: [
          {
            title: 'Configuring Base URL',
            body: 'The playground automatically normalizes trailing slashes and ensures all path and query parameters are combined accurately.',
            codeBlock: {
              language: 'bash',
              code: `# Production Base URL
https://free-api-server.vercel.app`
            }
          }
        ]
      },
      {
        heading: 'Quickstart Request Example',
        content: 'Execute a quick test against the fake users endpoint using cURL or modern JavaScript fetch:',
        subsections: [
          {
            title: 'cURL Example',
            body: 'Execute this command directly in your terminal:',
            codeBlock: {
              language: 'bash',
              code: `curl "https://free-api-server.vercel.app/fake/users"`
            }
          },
          {
            title: 'JavaScript Fetch Example',
            body: 'Call from any modern browser or Node.js environment:',
            codeBlock: {
              language: 'javascript',
              code: `fetch("https://free-api-server.vercel.app/fake/users")
  .then(res => res.json())
  .then(users => console.log("Fetched users:", users))
  .catch(err => console.error("Error:", err));`
            }
          }
        ]
      }
    ]
  },

  'http-status-codes': {
    id: 'http-status-codes',
    title: 'HTTP Status Codes',
    category: 'reference',
    shortDescription: 'Standard HTTP response codes returned by Free API Server endpoints.',
    icon: 'ShieldAlert',
    sections: [
      {
        heading: 'Status Code Overview',
        content: 'Free API Server uses standard HTTP status codes in response headers and mirrors them within the response payload body whenever errors occur.'
      },
      {
        heading: 'Status Codes Reference',
        content: 'The table below details all supported status codes and common triggers:',
        subsections: [
          {
            title: '200 OK',
            body: 'Standard response for successful HTTP requests. The payload will contain the requested resource, array of entities, or health check status.',
            codeBlock: {
              language: 'json',
              code: `{
  "success": true,
  "statusCode": 200,
  "data": [ ... ]
}`
            }
          },
          {
            title: '400 Bad Request',
            body: 'Returned when a request is malformed, missing mandatory parameters (such as latitude/longitude on /weather or value when type != all on /countries), or requesting an unsupported resource type.',
            codeBlock: {
              language: 'json',
              code: `{
  "success": false,
  "statusCode": 400,
  "status": false,
  "message": "latitude is required"
}`
            }
          },
          {
            title: '404 Not Found',
            body: 'Returned when an unknown route is requested, or when a specific numeric ID does not exist in the collection.',
            codeBlock: {
              language: 'json',
              code: `{
  "success": false,
  "statusCode": 404,
  "status": false,
  "message": "Resource not found"
}`
            }
          },
          {
            title: '408 Request Timeout',
            body: 'Occurs if an upstream third-party data supplier (e.g. meteorological data or external country repository) fails to reply within the timeout threshold.',
            codeBlock: {
              language: 'json',
              code: `{
  "success": false,
  "statusCode": 408,
  "status": false,
  "message": "Upstream request timeout"
}`
            }
          },
          {
            title: '500 Internal Server Error',
            body: 'Indicates an unexpected server-side exception occurred while processing the request.',
            codeBlock: {
              language: 'json',
              code: `{
  "success": false,
  "statusCode": 500,
  "status": false,
  "message": "Internal server error"
}`
            }
          },
          {
            title: '502 Bad Gateway',
            body: 'Returned when the server received an invalid or unparseable response from an upstream provider.',
            codeBlock: {
              language: 'json',
              code: `{
  "success": false,
  "statusCode": 502,
  "status": false,
  "message": "Failed to communicate with upstream API"
}`
            }
          }
        ]
      }
    ]
  },

  'error-handling': {
    id: 'error-handling',
    title: 'Error Handling Guide',
    category: 'reference',
    shortDescription: 'Standardized error payload schemas, client-side recovery patterns, and troubleshooting.',
    icon: 'AlertTriangle',
    sections: [
      {
        heading: 'Standard Error Format',
        content: 'Whenever an error occurs, the API returns an application/json error payload adhering to a consistent schema across all routes:',
        subsections: [
          {
            title: 'JSON Error Structure',
            body: 'Always inspect the statusCode and message properties to understand why the request failed:',
            codeBlock: {
              language: 'json',
              code: `{
  "success": false,
  "statusCode": 400,
  "status": false,
  "message": "latitude is required"
}`
            }
          }
        ]
      },
      {
        heading: 'Client-Side Error Handling Best Practices',
        content: 'When writing frontend client integrations, ensure you check response.ok and handle non-200 responses gracefully.',
        subsections: [
          {
            title: 'Robust Fetch Error Handler (TypeScript)',
            body: 'Here is a recommended error handling utility for your frontend applications:',
            codeBlock: {
              language: 'typescript',
              code: `async function apiGet<T>(endpointUrl: string): Promise<T> {
  try {
    const response = await fetch(endpointUrl, {
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      let errorDetails = "Unknown error";
      try {
        const errorJson = await response.json();
        errorDetails = errorJson.message || JSON.stringify(errorJson);
      } catch {
        errorDetails = await response.text();
      }
      throw new Error(\`HTTP \${response.status}: \${errorDetails}\`);
    }

    return (await response.json()) as T;
  } catch (err: any) {
    // Handle Network / CORS / Parsing failures
    console.error("API Call Failed:", err.message);
    throw err;
  }
}`
            }
          }
        ]
      },
      {
        heading: 'Common Failure Scenarios & Solutions',
        content: 'Troubleshooting guide for common playground and application states:',
        subsections: [
          {
            title: 'Missing Required Parameters',
            body: 'Verify that required path and query parameters are supplied. For example, /weather requires both latitude and longitude; /countries requires value unless type is set to all.'
          },
          {
            title: 'CORS & Browser Fetch Restrictions',
            body: 'The hosted production server allows all cross-origin requests (Access-Control-Allow-Origin: *). If using a custom local Base URL, ensure your local server enables CORS headers.'
          },
          {
            title: 'Rate Limits & Upstream Throttling',
            body: 'Avoid sending aggressive high-frequency bursts (e.g. hundreds of simultaneous calls/second) to prevent upstream provider throttling.'
          }
        ]
      }
    ]
  },

  'open-food-facts': {
    id: 'open-food-facts',
    title: 'Open Food Facts API Guide',
    category: 'reference',
    shortDescription: 'Complete developer documentation for Open Food Facts API: product barcode lookup, search, categories, brands, countries, ingredients, additives, allergens, labels, and packaging metadata.',
    icon: 'UtensilsCrossed',
    sections: [
      {
        heading: 'Overview & Upstream Configuration',
        content: 'The Open Food Facts API exposes comprehensive product metadata, product catalog search, and nutritional taxonomies sourced from the global Open Food Facts database. All operations are read-only GET requests with zero authentication required.',
        subsections: [
          {
            title: 'Endpoint Specification',
            body: 'Direct GET requests to /open-food-facts with operation types configured via query parameters:',
            codeBlock: {
              language: 'text',
              code: `Endpoint:     GET /open-food-facts
Base URL:     http://localhost:3000
Upstream API: https://world.openfoodfacts.org/api/v2
Timeout:      15000ms (15 seconds)
Default Type: product`
            }
          },
          {
            title: 'Authentication & Headers',
            body: 'No API keys, bearer tokens, or client credentials are required. Requests automatically forward headers to the upstream Open Food Facts API v2.'
          }
        ]
      },
      {
        heading: 'Supported Operations & Parameter Contract',
        content: 'The endpoint accepts a type parameter selecting the target operation. Operations requiring an identifier validate that the value parameter is present and return 400 Bad Request when missing.',
        subsections: [
          {
            title: 'Operations Reference Table',
            body: 'Supported operation types and their corresponding upstream routes and parameter requirements:',
            codeBlock: {
              language: 'text',
              code: `| Type              | Upstream Path          | Required Params | Description                              |
| ----------------- | ---------------------- | --------------- | ---------------------------------------- |
| product (default) | /product/{barcode}     | value           | Product details by barcode (e.g. 737628064502) |
| products          | /search                | None            | Search products (optional search_terms)  |
| categories        | /categories            | None            | List product categories                  |
| category          | /categories/{id}       | value           | Category details by identifier           |
| brands            | /brands                | None            | List brands                              |
| brand             | /brands/{id}           | value           | Brand details by identifier              |
| countries         | /countries             | None            | List countries                           |
| ingredients       | /ingredients           | None            | List ingredients                         |
| ingredient        | /ingredients/{id}      | value           | Ingredient details by identifier         |
| additives         | /additives             | None            | List additives                           |
| additive          | /additives/{id}        | value           | Additive details by identifier           |
| allergens         | /allergens             | None            | List allergens                           |
| allergen          | /allergens/{id}        | value           | Allergen details by identifier           |
| labels            | /labels                | None            | List labels                              |
| label             | /labels/{id}           | value           | Label details by identifier              |
| packaging         | /packaging             | None            | List packaging entries                   |
| packagingMaterial | /packaging/{id}        | value           | Packaging material details by identifier |`
            }
          },
          {
            title: 'Barcode Lookup vs. Taxonomy Search',
            body: 'For type=product, the value parameter is mapped to the upstream {barcode} path parameter. For type=products, search_terms (and any additional query filters) are forwarded as query parameters.'
          }
        ]
      },
      {
        heading: 'Request Examples',
        content: 'Common cURL commands for fetching product data, searching catalog items, and exploring taxonomies:',
        subsections: [
          {
            title: '1. Product Barcode Lookup',
            body: 'Fetch complete nutritional facts, nutriscore, ingredients, and allergen data for a barcode:',
            codeBlock: {
              language: 'bash',
              code: `curl "http://localhost:3000/open-food-facts?type=product&value=737628064502"`
            }
          },
          {
            title: '2. Product Search & Category Filtering',
            body: 'Search for products matching a category tag (e.g. beverages) or keyword (e.g. milk, chocolate):',
            codeBlock: {
              language: 'bash',
              code: `# Filter products by category tag
curl "http://localhost:3000/open-food-facts?type=products&categories_tags_en=beverages"

# Search products by keyword
curl "http://localhost:3000/open-food-facts?type=products&search_terms=milk"`
            }
          },
          {
            title: '3. Taxonomies & Listings',
            body: 'Query categories, brands, countries, ingredients, additives, allergens, labels, or packaging:',
            codeBlock: {
              language: 'bash',
              code: `# List categories
curl "http://localhost:3000/open-food-facts?type=categories"

# Category detail
curl "http://localhost:3000/open-food-facts?type=category&value=beverages"

# List brands
curl "http://localhost:3000/open-food-facts?type=brands"

# List countries
curl "http://localhost:3000/open-food-facts?type=countries"

# List ingredients
curl "http://localhost:3000/open-food-facts?type=ingredients"`
            }
          }
        ]
      },
      {
        heading: 'Response Payload & Status Codes',
        content: 'Responses include standard Open Food Facts API v2 schema structures with HTTP status codes matching the request status:',
        subsections: [
          {
            title: '200 OK — Successful Product Lookup',
            body: 'Contains the product object with nutriments, nutriscore_grade, nova_group, and ingredients_text:',
            codeBlock: {
              language: 'json',
              code: `{
  "code": "737628064502",
  "product": {
    "_id": "737628064502",
    "product_name": "Thai Peanut Noodle Kit",
    "brands": "Simply Asia",
    "categories": "Plant-based foods, Meals, Noodle dishes",
    "nutriments": {
      "energy-kcal_100g": 380,
      "fat_100g": 12,
      "carbohydrates_100g": 56,
      "proteins_100g": 10
    },
    "nutriscore_grade": "d",
    "nova_group": 4
  },
  "status": 1,
  "status_verbose": "product found"
}`
            }
          },
          {
            title: '400 Bad Request — Missing Required Value',
            body: 'Returned when an identifier-based operation (like product, category, brand, etc.) is called without a value parameter:',
            codeBlock: {
              language: 'json',
              code: `{
  "success": false,
  "statusCode": 400,
  "status": false,
  "message": "Missing required 'value' parameter for type=product"
}`
            }
          }
        ]
      }
    ]
  },

  'meal-db': {
    id: 'meal-db',
    title: 'TheMealDB API Reference',
    category: 'reference',
    shortDescription: 'Developer reference for TheMealDB API providing meal recipes, ingredients, categories, and cuisine lookups.',
    icon: 'Utensils',
    sections: [
      {
        heading: 'Endpoint Overview',
        content: 'The `/meal-db` endpoint provides meal, recipe, category, area, and ingredient data from TheMealDB database. Requests forward upstream directly to https://www.themealdb.com/api/json/v1/1.'
      },
      {
        heading: 'Supported Operations',
        content: 'The endpoint supports 8 distinct operations controlled via the `type` query parameter:',
        subsections: [
          {
            title: 'Operation Matrix',
            body: 'Summary of supported operations, upstream routes, and required parameters:',
            codeBlock: {
              language: 'markdown',
              code: `| Operation       | Upstream Endpoint           | Parameters                            | Description                             |
|-----------------|-----------------------------|---------------------------------------|-----------------------------------------|
| random          | /random.php                 | None (Default)                        | Get a single random meal recipe         |
| randomSelection | /randomselection.php        | None                                  | Get a random selection of meals         |
| lookup          | /lookup.php?i={value}       | value (Meal ID)                       | Lookup full meal details by ID          |
| search          | /search.php?s={value}       | value (Meal Name)                     | Search meals by name                    |
| filter          | /filter.php                 | category, area, and/or ingredient     | Filter meals by category, area, or item |
| categories      | /categories.php             | None                                  | List all meal categories with images    |
| areas           | /list.php?a=list            | None                                  | List all meal areas / cuisines          |
| ingredients     | /list.php?i=list            | None                                  | List all meal ingredients               |`
            }
          }
        ]
      },
      {
        heading: 'Request Examples',
        content: 'Common cURL commands for fetching random recipes, searching by name, looking up by ID, and filtering by category or area:',
        subsections: [
          {
            title: '1. Random Meal & Random Selection',
            body: 'Retrieve a single random recipe (default) or a batch of random meal selections:',
            codeBlock: {
              language: 'bash',
              code: `# Single random meal (default)
curl "http://localhost:3000/meal-db"

# Random meal selection
curl "http://localhost:3000/meal-db?type=randomSelection"`
            }
          },
          {
            title: '2. Meal ID Lookup & Search by Name',
            body: 'Lookup a meal by its unique ID or search meals by title:',
            codeBlock: {
              language: 'bash',
              code: `# Lookup meal by ID (52772)
curl "http://localhost:3000/meal-db?type=lookup&value=52772"

# Search meals by name (Arrabiata)
curl "http://localhost:3000/meal-db?type=search&value=Arrabiata"`
            }
          },
          {
            title: '3. Filter by Category, Area, or Ingredient',
            body: 'Filter meals by category, geographical area/cuisine, or main ingredient (at least one parameter required):',
            codeBlock: {
              language: 'bash',
              code: `# Filter by category
curl "http://localhost:3000/meal-db?type=filter&category=Seafood"

# Filter by area / cuisine
curl "http://localhost:3000/meal-db?type=filter&area=Indian"

# Filter by ingredient
curl "http://localhost:3000/meal-db?type=filter&ingredient=Chicken"`
            }
          },
          {
            title: '4. List Categories, Areas & Ingredients',
            body: 'Retrieve taxonomies and listing entries without additional parameters:',
            codeBlock: {
              language: 'bash',
              code: `# List meal categories
curl "http://localhost:3000/meal-db?type=categories"

# List meal areas / cuisines
curl "http://localhost:3000/meal-db?type=areas"

# List meal ingredients
curl "http://localhost:3000/meal-db?type=ingredients"`
            }
          }
        ]
      },
      {
        heading: 'Response Payload & Status Codes',
        content: 'Responses return standard TheMealDB JSON schema structures with HTTP status codes matching the request status:',
        subsections: [
          {
            title: '200 OK — Successful Meal Query',
            body: 'Contains the meals array with complete instructions, ingredients, measures, category, and tags:',
            codeBlock: {
              language: 'json',
              code: `{
  "meals": [
    {
      "idMeal": "52772",
      "strMeal": "Teriyaki Chicken Casserole",
      "strCategory": "Chicken",
      "strArea": "Japanese",
      "strInstructions": "Preheat oven to 350° F. Spray a 9x13-inch baking dish with cooking spray...",
      "strMealThumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
      "strTags": "Meat,Casserole",
      "strYoutube": "https://www.youtube.com/watch?v=4aZr5hZXP_s",
      "strIngredient1": "soy sauce",
      "strMeasure1": "3/4 cup"
    }
  ]
}`
            }
          },
          {
            title: '400 Bad Request — Missing Required Parameter',
            body: 'Returned when lookup/search is missing value, or filter is called without category, area, or ingredient:',
            codeBlock: {
              language: 'json',
              code: `{
  "success": false,
  "statusCode": 400,
  "status": false,
  "message": "Missing required 'value' parameter for type=lookup"
}`
            }
          }
        ]
      }
    ]
  },

  'cocktail-db': {
    id: 'cocktail-db',
    title: 'TheCocktailDB API Reference',
    category: 'reference',
    shortDescription: 'Developer reference for TheCocktailDB API providing cocktail recipes, search, filters, categories, glass types, ingredients, and alcoholic classifications.',
    icon: 'Wine',
    sections: [
      {
        heading: 'Endpoint Overview',
        content: 'The `/cocktail-db` endpoint provides cocktail recipes, search, filters, categories, glass types, ingredients, and alcoholic classifications from TheCocktailDB database. Requests forward upstream directly to https://www.thecocktaildb.com/api/json/v1/1.'
      },
      {
        heading: 'Supported Operations',
        content: 'The endpoint supports 9 distinct operations controlled via the `type` query parameter:',
        subsections: [
          {
            title: 'Operation Matrix',
            body: 'Summary of supported operations, upstream routes, and required parameters:',
            codeBlock: {
              language: 'markdown',
              code: `| Operation       | Upstream Endpoint           | Parameters                            | Description                             |
|-----------------|-----------------------------|---------------------------------------|-----------------------------------------|
| random          | /random.php                 | None (Default)                        | Get a random cocktail                   |
| randomMultiple  | /randomselection.php        | None                                  | Get a random selection of cocktails     |
| lookup          | /lookup.php?i={value}       | value (Cocktail ID)                   | Lookup full cocktail details by ID      |
| search          | /search.php?s={value}       | value (Cocktail Name)                 | Search cocktails by name                |
| filter          | /filter.php                 | ingredient, category, alcoholic, glass| Filter cocktails by attribute           |
| categories      | /list.php?c=list            | None                                  | List all cocktail categories            |
| glass           | /list.php?g=list            | None                                  | List all glass types                    |
| ingredients     | /list.php?i=list            | None                                  | List all cocktail ingredients           |
| alcoholic       | /list.php?a=list            | None                                  | List alcoholic classifications          |`
            }
          }
        ]
      },
      {
        heading: 'Request Examples',
        content: 'Common cURL commands for fetching random cocktails, searching by name, looking up by ID, and filtering by ingredient, category, alcoholic type, or glass:',
        subsections: [
          {
            title: '1. Random Cocktail & Random Multiple',
            body: 'Retrieve a single random recipe (default) or a selection of multiple random cocktails:',
            codeBlock: {
              language: 'bash',
              code: `# Single random cocktail (default)
curl "http://localhost:3000/cocktail-db"

# Random multiple cocktails
curl "http://localhost:3000/cocktail-db?type=randomMultiple"`
            }
          },
          {
            title: '2. Cocktail ID Lookup & Search by Name',
            body: 'Lookup a cocktail by ID or search cocktails by name:',
            codeBlock: {
              language: 'bash',
              code: `# Lookup cocktail by ID (11007)
curl "http://localhost:3000/cocktail-db?type=lookup&value=11007"

# Search cocktails by name (margarita)
curl "http://localhost:3000/cocktail-db?type=search&value=margarita"`
            }
          },
          {
            title: '3. Filter by Ingredient, Category, Alcoholic, or Glass',
            body: 'Filter cocktails by ingredient, category, alcoholic classification, or glass type (at least one parameter required):',
            codeBlock: {
              language: 'bash',
              code: `# Filter by ingredient
curl "http://localhost:3000/cocktail-db?type=filter&ingredient=Gin"

# Filter by category
curl "http://localhost:3000/cocktail-db?type=filter&category=Cocktail"

# Filter by alcoholic classification
curl "http://localhost:3000/cocktail-db?type=filter&alcoholic=Alcoholic"

# Filter by glass type
curl "http://localhost:3000/cocktail-db?type=filter&glass=Cocktail_glass"`
            }
          },
          {
            title: '4. List Categories, Glass Types, Ingredients & Alcoholic Classifications',
            body: 'Retrieve taxonomies and listing entries without additional parameters:',
            codeBlock: {
              language: 'bash',
              code: `# List cocktail categories
curl "http://localhost:3000/cocktail-db?type=categories"

# List glass types
curl "http://localhost:3000/cocktail-db?type=glass"

# List cocktail ingredients
curl "http://localhost:3000/cocktail-db?type=ingredients"

# List alcoholic classifications
curl "http://localhost:3000/cocktail-db?type=alcoholic"`
            }
          }
        ]
      },
      {
        heading: 'Response Payload & Status Codes',
        content: 'Responses return standard TheCocktailDB JSON schema structures with HTTP status codes matching the request status:',
        subsections: [
          {
            title: '200 OK — Successful Cocktail Query',
            body: 'Contains the drinks array with complete instructions, ingredients, measures, category, and tags:',
            codeBlock: {
              language: 'json',
              code: `{
  "drinks": [
    {
      "idDrink": "11007",
      "strDrink": "Margarita",
      "strCategory": "Ordinary Drink",
      "strAlcoholic": "Alcoholic",
      "strGlass": "Cocktail glass",
      "strInstructions": "Rub the rim of the glass with the lime slice to make the salt stick to it...",
      "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
      "strIngredient1": "Tequila",
      "strIngredient2": "Triple sec",
      "strIngredient3": "Lime juice",
      "strMeasure1": "1 1/2 oz",
      "strMeasure2": "1/2 oz",
      "strMeasure3": "1 oz"
    }
  ]
}`
            }
          },
          {
            title: '400 Bad Request — Missing Required Parameter',
            body: 'Returned when lookup/search is missing value, or filter is called without ingredient, category, alcoholic, or glass:',
            codeBlock: {
              language: 'json',
              code: `{
  "success": false,
  "statusCode": 400,
  "status": false,
  "message": "Missing required 'value' parameter for type=lookup"
}`
            }
          }
        ]
      }
    ]
  },
  jokeApi: {
    id: 'jokeApi',
    title: 'JokeAPI Guide & Specification',
    category: 'reference',
    shortDescription: 'Comprehensive documentation for fetching random, category-based, multiple, and filtered programming and general jokes via JokeAPI v2.',
    icon: 'Smile',
    sections: [
      {
        heading: 'Endpoint Overview',
        content: 'The `/joke-api` endpoint proxies requests to JokeAPI v2 (https://v2.jokeapi.dev), delivering curated jokes with rich classification flags, single or twopart formats, category filtering, and safe mode enforcement.',
        subsections: [
          {
            title: 'Endpoint URL',
            body: 'GET /joke-api (local proxy) -> https://v2.jokeapi.dev/joke'
          },
          {
            title: 'Supported Operation Types',
            body: 'random (default), joke (by ID), category (by specific category), categories (comma-separated categories), and filter (category with blacklistFlags and safe mode).'
          }
        ]
      },
      {
        heading: 'Operations & Examples',
        content: 'Configure the type parameter and optional filters to retrieve single or multiple jokes in twopart or single format.',
        subsections: [
          {
            title: '1. Random Joke',
            body: 'Returns a random joke across any category (GET /joke-api):',
            codeBlock: {
              language: 'bash',
              code: 'curl http://localhost:3000/joke-api'
            }
          },
          {
            title: '2. Joke by ID',
            body: 'Returns a specific joke by ID (GET /joke-api?type=joke&value=123):',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/joke-api?type=joke&value=123"'
            }
          },
          {
            title: '3. Category & Filtered Safe Jokes',
            body: 'Returns safe programming jokes excluding NSFW, religious, and political jokes:',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/joke-api?type=filter&value=Programming&blacklistFlags=nsfw,religious,political&safe=true"'
            }
          }
        ]
      },
      {
        heading: 'Response Schemas & Status Codes',
        content: 'JokeAPI returns structured JSON objects for single jokes or arrays when amount > 1.',
        subsections: [
          {
            title: '200 OK — Successful Joke Response',
            body: 'Returns joke metadata including category, twopart setup/delivery or single joke line, safety flags, and ID:',
            codeBlock: {
              language: 'json',
              code: `{
  "error": false,
  "category": "Programming",
  "type": "twopart",
  "setup": "Why did the programmer quit his job?",
  "delivery": "Because he didn't get arrays.",
  "flags": {
    "nsfw": false,
    "religious": false,
    "political": false,
    "racist": false,
    "sexist": false,
    "explicit": false
  },
  "id": 123,
  "safe": true,
  "lang": "en"
}`
            }
          },
          {
            title: '400 Bad Request — Missing Required Parameter',
            body: 'Returned when joke ID, category, or filter value is missing:',
            codeBlock: {
              language: 'json',
              code: `{
  "success": false,
  "statusCode": 400,
  "status": false,
  "message": "Missing required 'value' parameter for type=joke"
}`
            }
          }
        ]
      }
    ]
  },
  randomUser: {
    id: 'randomUser',
    title: 'Random User API Reference',
    category: 'reference',
    shortDescription: 'Comprehensive guide for the Random User API endpoints, filters, field selections, seeds, and pagination.',
    icon: 'Users',
    sections: [
      {
        heading: 'Overview & Upstream Architecture',
        content: 'The Random User API provides randomly generated user profiles with support for filtering by gender, nationality, selected fields, exclusions, seeds, pagination, and result count from Random User Generator (https://randomuser.me/api).',
        subsections: [
          {
            title: 'Upstream & Local Endpoints',
            body: 'Upstream: https://randomuser.me/api\nLocal Endpoint: GET /random-user\n\nAll query parameters other than the local "type" parameter are forwarded directly to the upstream Random User API.'
          },
          {
            title: 'Single Operation Architecture',
            body: 'The only supported operation is "random" (defaulting to random). The local "type" selector defaults to "random" and is omitted from the default request path.'
          }
        ]
      },
      {
        heading: 'Supported Query Parameters',
        content: 'Configure user generation with flexible query parameters.',
        subsections: [
          {
            title: 'results — Result Count',
            body: 'Positive integer specifying the number of user profiles to generate (e.g. results=10).'
          },
          {
            title: 'gender — Gender Filter',
            body: 'Filter generated profiles by gender. Supported values: "male" or "female". Omit or select "Any" for mixed results.'
          },
          {
            title: 'nat — Nationality Filter',
            body: 'Comma-separated nationality codes to restrict users (e.g. nat=in or nat=in,us,gb).'
          },
          {
            title: 'seed — Deterministic Seed',
            body: 'Alphanumeric seed string (e.g. seed=foobar) allowing consistent, reproducible user generations.'
          },
          {
            title: 'page — Seeded Pagination',
            body: 'Positive integer page number used in conjunction with a seed (e.g. page=2&seed=foobar).'
          },
          {
            title: 'inc & exc — Field Selection & Exclusion',
            body: 'Comma-separated field names to include (e.g. inc=name,email,picture) or exclude (e.g. exc=login).'
          },
          {
            title: 'noinfo — Exclude Metadata',
            body: 'Boolean flag. Setting noinfo=true excludes the "info" metadata object from the response.'
          }
        ]
      },
      {
        heading: 'Example Requests & Responses',
        content: 'Common cURL and HTTP request patterns for Random User API.',
        subsections: [
          {
            title: 'GET /random-user — Default Random User',
            body: 'Returns a single random user profile with standard info metadata.',
            codeBlock: {
              language: 'bash',
              code: 'curl http://localhost:3000/random-user'
            }
          },
          {
            title: 'GET /random-user?results=10&nat=in — Ten Indian Users',
            body: 'Generates 10 users with Indian nationality.',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/random-user?results=10&nat=in"'
            }
          },
          {
            title: 'GET /random-user?results=10&page=2&seed=foobar — Seeded Pagination',
            body: 'Retrieves page 2 for seed "foobar".',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/random-user?results=10&page=2&seed=foobar"'
            }
          }
        ]
      }
    ]
  },
  bored: {
    id: 'bored',
    title: 'Bored API Reference',
    category: 'reference',
    shortDescription: 'Comprehensive guide for the Bored API endpoints, operations, filters, activity keys, and cURL examples.',
    icon: 'Sparkles',
    sections: [
      {
        heading: 'Overview & Upstream Architecture',
        content: 'The Bored API provides random activities and supports filtering activities by type and number of participants, as well as retrieving an activity by key from Bored API (https://bored-api.appbrewery.com).',
        subsections: [
          {
            title: 'Upstream & Local Endpoints',
            body: 'Upstream: https://bored-api.appbrewery.com\nLocal Endpoint: GET /bored\n\nAll operations route through the local /bored endpoint.'
          },
          {
            title: 'Parameter Naming Distinction (operation vs type)',
            body: 'The local operation parameter is named "operation" so that it does not conflict with the upstream "type" filter parameter. The default operation is "random" and maps to GET /bored.'
          }
        ]
      },
      {
        heading: 'Supported Operations & Mappings',
        content: 'Three operations are supported: random, filter, and activity.',
        subsections: [
          {
            title: 'operation=random — Random Activity',
            body: 'Upstream: /random\nReturns a random activity suggestion. Defaults to GET /bored without requiring extra parameters.'
          },
          {
            title: 'operation=filter — Filter Activities',
            body: 'Upstream: /filter\nSupports optional query parameters "type" (e.g. education, recreational, social, diy, charity, cooking, relaxation, music, busywork) and "participants" (e.g. 2).'
          },
          {
            title: 'operation=activity — Activity by Key',
            body: 'Upstream: /activity/{key}\nRequires the "value" parameter representing the activity key (e.g. value=3943506).'
          }
        ]
      },
      {
        heading: 'Example Requests & Responses',
        content: 'Common cURL and HTTP request patterns for the Bored API.',
        subsections: [
          {
            title: 'GET /bored — Random Activity',
            body: 'Fetches a single random activity.',
            codeBlock: {
              language: 'bash',
              code: 'curl http://localhost:3000/bored'
            }
          },
          {
            title: 'GET /bored?operation=filter&type=education — Educational Activity',
            body: 'Filters activities by category type "education".',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/bored?operation=filter&type=education"'
            }
          },
          {
            title: 'GET /bored?operation=filter&participants=2 — Two Participants',
            body: 'Filters activities for 2 participants.',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/bored?operation=filter&participants=2"'
            }
          },
          {
            title: 'GET /bored?operation=filter&type=social&participants=2 — Social Activity for Two',
            body: 'Combines type and participants filters.',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/bored?operation=filter&type=social&participants=2"'
            }
          },
          {
            title: 'GET /bored?operation=activity&value=3943506 — Activity by Key',
            body: 'Retrieves the specific activity by key 3943506.',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/bored?operation=activity&value=3943506"'
            }
          }
        ]
      }
    ]
  },
  deckOfCards: {
    id: 'deckOfCards',
    title: 'Deck of Cards API Reference',
    category: 'reference',
    shortDescription: 'Technical guide and reference for creating decks, shuffling, drawing cards, and managing named card piles.',
    icon: 'Layers',
    sections: [
      {
        heading: 'Overview & Upstream Architecture',
        content: 'The Deck of Cards API provides comprehensive card deck operations, from creating fresh decks and drawing cards to managing separate named piles. All requests are proxied from the upstream Deck of Cards service (https://deckofcardsapi.com/api/deck).',
        subsections: [
          {
            title: 'Local Endpoint Route',
            body: 'GET /deck-of-cards (default localhost:3000/deck-of-cards)'
          },
          {
            title: 'Upstream Base API',
            body: 'https://deckofcardsapi.com/api/deck'
          },
          {
            title: 'Operation Routing',
            body: 'The local query parameter "operation" dynamically determines the upstream endpoint path. When no operation is provided, it defaults to newShuffle (/new/shuffle/).'
          }
        ]
      },
      {
        heading: 'Supported Operations & Upstream Mappings',
        content: 'The Deck of Cards API supports 10 distinct operations mapped directly to upstream paths:',
        subsections: [
          {
            title: 'operation=new — New Unshuffled Deck',
            body: 'Upstream: /new/\nCreates a new unshuffled standard 52-card deck. Supports optional deckCount (number of decks) and jokersEnabled (true/false).'
          },
          {
            title: 'operation=newShuffle — New Shuffled Deck (Default)',
            body: 'Upstream: /new/shuffle/\nCreates a new shuffled deck. Supports optional deckCount and jokersEnabled. When calling GET /deck-of-cards without parameters, this is the default.'
          },
          {
            title: 'operation=draw — Draw Cards from Deck',
            body: 'Upstream: /{deckId}/draw/\nRequires deckId. Supports optional count parameter specifying the number of cards to draw.'
          },
          {
            title: 'operation=shuffle — Reshuffle Existing Deck',
            body: 'Upstream: /{deckId}/shuffle/\nRequires deckId. Supports optional remaining=true to shuffle only undrawn cards.'
          },
          {
            title: 'operation=return — Return Cards to Deck',
            body: 'Upstream: /{deckId}/return/\nRequires deckId. Supports optional comma-separated cards parameter (e.g. cards=AS,2S).'
          },
          {
            title: 'operation=pileAdd — Add Cards to Pile',
            body: 'Upstream: /{deckId}/pile/{pileName}/add/\nRequires deckId, pileName, and cards parameter (e.g. cards=AS,2S).'
          },
          {
            title: 'operation=pileShuffle — Shuffle Pile',
            body: 'Upstream: /{deckId}/pile/{pileName}/shuffle/\nRequires deckId and pileName to shuffle cards inside the specified pile.'
          },
          {
            title: 'operation=pileList — List Cards in Pile',
            body: 'Upstream: /{deckId}/pile/{pileName}/list/\nRequires deckId and pileName to list all cards currently residing in the pile.'
          },
          {
            title: 'operation=pileDraw — Draw Cards from Pile',
            body: 'Upstream: /{deckId}/pile/{pileName}/draw/\nRequires deckId and pileName. Supports optional count parameter.'
          },
          {
            title: 'operation=pileReturn — Return Pile to Deck',
            body: 'Upstream: /{deckId}/pile/{pileName}/return/\nRequires deckId and pileName to return all cards in that pile back to the main deck.'
          }
        ]
      },
      {
        heading: 'Card Code Standards',
        content: 'Cards are represented by 2-character string codes combining value and suit:',
        subsections: [
          {
            title: 'Values',
            body: 'A (Ace), 2, 3, 4, 5, 6, 7, 8, 9, 0 (10), J (Jack), Q (Queen), K (King).'
          },
          {
            title: 'Suits',
            body: 'S (Spades), D (Diamonds), C (Clubs), H (Hearts).'
          },
          {
            title: 'Examples',
            body: 'AS (Ace of Spades), 0D (10 of Diamonds), KH (King of Hearts), 2C (2 of Clubs), X1/X2 (Jokers).'
          }
        ]
      },
      {
        heading: 'Example Requests & Responses',
        content: 'Standard cURL request patterns for interacting with the Deck of Cards API:',
        subsections: [
          {
            title: 'GET /deck-of-cards — Create & Shuffle New Deck',
            body: 'Creates and shuffles a new standard 52-card deck.',
            codeBlock: {
              language: 'bash',
              code: 'curl http://localhost:3000/deck-of-cards'
            }
          },
          {
            title: 'GET /deck-of-cards?operation=draw&deckId=3p40paa87x90&count=2 — Draw 2 Cards',
            body: 'Draws 2 cards from an existing deck.',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/deck-of-cards?operation=draw&deckId=3p40paa87x90&count=2"'
            }
          },
          {
            title: 'GET /deck-of-cards?operation=pileAdd&deckId=3p40paa87x90&pileName=discard&cards=AS,2S — Add Cards to Pile',
            body: 'Adds specified cards to the named "discard" pile.',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/deck-of-cards?operation=pileAdd&deckId=3p40paa87x90&pileName=discard&cards=AS,2S"'
            }
          },
          {
            title: 'GET /deck-of-cards?operation=pileList&deckId=3p40paa87x90&pileName=discard — List Cards in Pile',
            body: 'Lists the cards currently in the "discard" pile.',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/deck-of-cards?operation=pileList&deckId=3p40paa87x90&pileName=discard"'
            }
          },
          {
            title: 'GET /deck-of-cards?operation=pileDraw&deckId=3p40paa87x90&pileName=discard&count=2 — Draw From Pile',
            body: 'Draws 2 cards from the "discard" pile.',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/deck-of-cards?operation=pileDraw&deckId=3p40paa87x90&pileName=discard&count=2"'
            }
          }
        ]
      }
    ]
  },

  chess: {
    id: 'chess',
    title: 'Chess.com Public API Guide',
    category: 'reference',
    shortDescription: 'Official read-only endpoints for chess puzzles, titled players, profiles, monthly PGN games, clubs, countries, streamers, and leaderboards.',
    icon: 'Crown',
    sections: [
      {
        heading: 'Overview & Upstream Base URL',
        content: 'The Chess.com Public API allows developers to read public data from Chess.com including daily tactical puzzles, random puzzles, player profiles, game archives, rated matches, club memberships, country rosters, and live streaming broadcasters.'
      },
      {
        heading: 'Operations & Query Parameters',
        content: 'The /chess route supports various operations configured via the "type" parameter:',
        subsections: [
          {
            title: 'type=dailyPuzzle (Default)',
            body: 'Upstream: /puzzle\nFetches today\'s daily tactical chess puzzle with FEN, PGN, title, and solutions. Default behavior when requesting /chess directly.'
          },
          {
            title: 'type=randomPuzzle',
            body: 'Upstream: /puzzle/random\nFetches a random puzzle from the daily puzzle archive.'
          },
          {
            title: 'type=puzzle & value={id}',
            body: 'Upstream: /puzzle/{id}\nFetches a specific puzzle by ID.'
          },
          {
            title: 'type=player & username={username}',
            body: 'Upstream: /player/{username}\nFetches public profile details, status, avatar URL, title, followers, and joined timestamp.'
          },
          {
            title: 'type=playerStats & username={username}',
            body: 'Upstream: /player/{username}/stats\nFetches player ratings, record (win/loss/draw), and best ratings across rapid, blitz, bullet, daily, tactics, and puzzle rush.'
          },
          {
            title: 'type=playerArchives & username={username}',
            body: 'Upstream: /player/{username}/games/archives\nFetches array of available monthly game archive endpoints.'
          },
          {
            title: 'type=playerGames & username={username}&year={year}&month={month}',
            body: 'Upstream: /player/{username}/games/{year}/{month}/pgn\nFetches standard Portable Game Notation (PGN) for all rated and casual games played during that calendar month.'
          },
          {
            title: 'type=titled & title={title}',
            body: 'Upstream: /titled/{title}\nFetches list of usernames holding the given FIDE / Chess.com title (GM, WGM, IM, WIM, FM, WFM, CM, WCM, NM, WNM).'
          },
          {
            title: 'type=club & club={club}',
            body: 'Upstream: /club/{club}\nFetches club metadata, description, member count, and admin usernames.'
          },
          {
            title: 'type=country & country={country}',
            body: 'Upstream: /country/{country}\nFetches country details by 2-letter ISO code (e.g. US, IN, NO).'
          },
          {
            title: 'type=leaderboards',
            body: 'Upstream: /leaderboards\nFetches top 50 leaderboards across daily, live, tactics, and lessons.'
          },
          {
            title: 'type=streamers',
            body: 'Upstream: /streamers\nFetches all active verified Chess.com community streamers.'
          }
        ]
      },
      {
        heading: 'Example Requests',
        content: 'Ready-to-run cURL snippets for interacting with the Chess.com API endpoints:',
        subsections: [
          {
            title: 'Daily Puzzle',
            body: 'Get the daily puzzle:',
            codeBlock: {
              language: 'bash',
              code: 'curl http://localhost:3000/chess'
            }
          },
          {
            title: 'Grandmaster Player Profile',
            body: 'Lookup Hikaru Nakamura\'s profile:',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/chess?type=player&username=hikaru"'
            }
          },
          {
            title: 'Player Performance Ratings',
            body: 'Lookup player statistics:',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/chess?type=playerStats&username=hikaru"'
            }
          },
          {
            title: 'Monthly Game Archive (PGN)',
            body: 'Get monthly games notation:',
            codeBlock: {
              language: 'bash',
              code: 'curl "http://localhost:3000/chess?type=playerGames&username=hikaru&year=2026&month=01"'
            }
          }
        ]
      }
    ]
  }
};
