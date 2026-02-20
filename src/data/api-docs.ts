export interface ApiParameter {
  name: string
  type: string
  required?: boolean
  description: string
  example?: string
}

export interface ApiSchemaField {
  name: string
  type: string
  required?: boolean
  description: string
  nested?: ApiSchemaField[]
}

export interface ApiResponse {
  code: number
  description: string
}

export interface ApiEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  summary: string
  description: string
  parameters?: ApiParameter[]
  requestBodySchema?: ApiSchemaField[]
  responseSchema?: ApiSchemaField[]
  responses: ApiResponse[]
  requestExample: string
  responseExample: string
}

export interface ApiSection {
  id: string
  title: string
  endpoints: ApiEndpoint[]
}

export const apiSections: ApiSection[] = [
  {
    id: 'address',
    title: 'Адреса и геолокация',
    endpoints: [
      {
        id: 'region-search',
        method: 'POST',
        path: '/api/address/hints/region/search',
        summary: 'Поиск регионов',
        description: 'Метод возвращает список регионов по заданным фильтрам. Поддерживает пагинацию и поиск по названию региона и стране.',
        requestBodySchema: [
          {
            name: 'filters',
            type: 'object',
            required: true,
            description: 'Объект с фильтрами для поиска регионов',
            nested: [
              { name: 'country', type: 'string', description: 'Код страны (ISO 3166-1 alpha-2). Пустая строка — все страны.' },
              { name: 'region_name', type: 'string', description: 'Название региона для поиска по подстроке.' },
              { name: 'ordering', type: 'string', description: 'Поле сортировки результатов.' }
            ]
          },
          {
            name: 'paginate',
            type: 'object',
            description: 'Параметры пагинации',
            nested: [
              { name: 'page', type: 'integer', description: 'Номер страницы (начиная с 1).' },
              { name: 'pp_items', type: 'integer', description: 'Количество элементов на странице.' }
            ]
          }
        ],
        responseSchema: [
          {
            name: 'page_data',
            type: 'array',
            description: 'Массив найденных регионов',
            nested: [
              { name: 'id', type: 'integer', description: 'Уникальный идентификатор региона.' },
              { name: 'locales', type: 'object', description: 'Локализованные названия по коду языка (en, ru, fr и т.д.).' },
              { name: 'country', type: 'string', description: 'Код страны (ISO 3166-1 alpha-2).' },
              { name: 'country_id', type: 'integer', description: 'Идентификатор страны.' },
              { name: 'region_iso', type: 'string', description: 'ISO-код региона.' }
            ]
          },
          { name: 'page', type: 'integer', description: 'Текущий номер страницы.' },
          { name: 'pp_items', type: 'integer', description: 'Количество элементов на странице.' }
        ],
        responses: [
          { code: 200, description: 'Успешно' },
          { code: 400, description: 'Неправильный запрос' },
          { code: 401, description: 'Не авторизован' },
          { code: 429, description: 'Слишком много запросов' }
        ],
        requestExample: `{
  "filters": {
    "country": "",
    "region_name": "",
    "ordering": ""
  },
  "paginate": {
    "page": 1,
    "pp_items": 15
  }
}`,
        responseExample: `{
  "page_data": [
    {
      "id": 333,
      "locales": {
        "en": {},
        "ru": {
          "region_name": "Paris"
        },
        "fr": {}
      },
      "country": "FR",
      "country_id": 4,
      "region_iso": "75001"
    }
  ],
  "page": 1,
  "pp_items": 15
}`
      }
    ]
  },
  {
    id: 'products',
    title: 'Товары',
    endpoints: [
      {
        id: 'product-search',
        method: 'POST',
        path: '/api/v1/products/search',
        summary: 'Поиск товаров',
        description: 'Метод возвращает список товаров по заданным фильтрам. Поддерживает поиск по названию, категории, ценовому диапазону и пагинацию результатов.',
        requestBodySchema: [
          {
            name: 'query',
            type: 'string',
            description: 'Поисковый запрос. Поиск выполняется по названию и описанию товара.'
          },
          {
            name: 'category_id',
            type: 'integer',
            description: 'ID категории товара. Фильтрация по конкретной категории.'
          },
          {
            name: 'min_price',
            type: 'number',
            description: 'Минимальная цена товара в рублях. Включительно.'
          },
          {
            name: 'max_price',
            type: 'number',
            description: 'Максимальная цена товара в рублях. Включительно.'
          },
          {
            name: 'limit',
            type: 'integer',
            description: 'Количество товаров на странице. По умолчанию 20, максимум 100.'
          },
          {
            name: 'offset',
            type: 'integer',
            description: 'Смещение для пагинации. Сколько записей пропустить.'
          }
        ],
        responseSchema: [
          {
            name: 'items',
            type: 'array',
            description: 'Массив найденных товаров',
            nested: [
              { name: 'id', type: 'integer', description: 'Уникальный идентификатор товара.' },
              { name: 'name', type: 'string', description: 'Название товара.' },
              { name: 'description', type: 'string', description: 'Описание товара.' },
              { name: 'price', type: 'number', description: 'Цена в рублях.' },
              { name: 'category_id', type: 'integer', description: 'ID категории товара.' },
              { name: 'in_stock', type: 'boolean', description: 'Наличие на складе.' }
            ]
          },
          { name: 'total', type: 'integer', description: 'Общее количество найденных товаров.' },
          { name: 'limit', type: 'integer', description: 'Количество элементов на странице.' },
          { name: 'offset', type: 'integer', description: 'Смещение для пагинации.' }
        ],
        responses: [
          { code: 200, description: 'Успешно' },
          { code: 400, description: 'Неправильный запрос' },
          { code: 401, description: 'Не авторизован' },
          { code: 429, description: 'Слишком много запросов' }
        ],
        requestExample: `{
  "query": "кроссовки",
  "category_id": 105,
  "min_price": 1000,
  "max_price": 5000,
  "limit": 20,
  "offset": 0
}`,
        responseExample: `{
  "items": [
    {
      "id": 12345,
      "name": "Кроссовки беговые",
      "description": "Удобные кроссовки для бега",
      "price": 3490,
      "category_id": 105,
      "in_stock": true
    }
  ],
  "total": 156,
  "limit": 20,
  "offset": 0
}`
      }
    ]
  }
]
