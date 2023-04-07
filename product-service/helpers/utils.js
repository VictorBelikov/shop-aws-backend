export const joinProductsWithStocks = (products, stocks) =>
  products.map((product) => ({
    ...product,
    count: stocks.find(({ product_id }) => product_id === product.id)?.count ?? 0,
  }));

export const joinProductWithStock = (product, stock) => ({ ...product, count: stock?.count });

export const logIncomingRequest = ({ httpMethod, path, pathParameters, queryStringParameters }) => {
  console.info(
    `method: ${httpMethod}; path: ${path}; path params: ${
      pathParameters ? JSON.stringify(pathParameters) : ''
    }; query params: ${queryStringParameters ? JSON.stringify(queryStringParameters) : ''}`,
  );
};
