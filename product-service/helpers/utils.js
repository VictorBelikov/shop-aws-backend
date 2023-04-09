import { customError } from './errorService';

// Use only with DynamoDB
// export const joinProductsWithStocks = (products, stocks) =>
//   products.map((product) => ({
//     ...product,
//     count: stocks.find(({ product_id }) => product_id === product.id)?.count ?? 0,
//   }));

// Use only with DynamoDB
// export const joinProductWithStock = (product, stock) => ({ ...product, count: stock?.count });

export const validateProductData = ({ title, description, price, count }) => {
  if (
    Number.isNaN(Number(count)) ||
    Number.isNaN(Number(price)) ||
    typeof description !== 'string' ||
    typeof title !== 'string' ||
    !description.length ||
    !title.length
  ) {
    throw customError('Product data is invalid', 400);
  }
};

export const logIncomingRequest = ({ httpMethod, path, pathParameters, queryStringParameters }) => {
  console.info(
    `method: ${httpMethod}; path: ${path}; path params: ${
      pathParameters ? JSON.stringify(pathParameters) : ''
    }; query params: ${queryStringParameters ? JSON.stringify(queryStringParameters) : ''}`,
  );
};
