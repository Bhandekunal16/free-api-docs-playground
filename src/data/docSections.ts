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
  }
};
