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
