import { customError } from './errorService';
import { STATUS_CODE } from '../constants/statusCode';

export const joinProductsWithStocks = (products, stocks) =>
  products.map((product) => ({
    ...product,
    count: stocks.find(({ product_id }) => product_id === product.id)?.count,
  }));

export const joinProductWithStock = (product, stock) => ({ ...product, count: stock?.count });

export const mapProductsToRequestItems = (products) =>
  products.map((product) => ({
    PutRequest: {
      Item: { id: product.id, title: product.title, description: product.description, price: product.price },
    },
  }));

export const mapProductsToRequestStocks = (products) =>
  products.map(({ id, count }) => ({ PutRequest: { Item: { product_id: id, count } } }));

export const validateProductData = ({ title, description, price, count }) => {
  if (
    Number.isNaN(Number(count)) ||
    Number.isNaN(Number(price)) ||
    typeof description !== 'string' ||
    typeof title !== 'string' ||
    !description.length ||
    !title.length
  ) {
    throw customError('Product data is invalid', STATUS_CODE.BAD_REQUEST);
  }
};

export const logIncomingRequest = ({ httpMethod, path, pathParameters, queryStringParameters }) => {
  console.info(
    `method: ${httpMethod}; path: ${path}; path params: ${
      pathParameters ? JSON.stringify(pathParameters) : ''
    }; query params: ${queryStringParameters ? JSON.stringify(queryStringParameters) : ''}`,
  );
};
