import { badResponse, successfulResponse } from '../helpers/responses.js';
import { logIncomingRequest } from '../helpers/utils';
import { customError } from '../helpers/errorService';
import { getPostgresClient } from '../helpers/db';

export const getProductsList = async (event) => {
  logIncomingRequest(event);

  const client = await getPostgresClient();

  try {
    const { rows: products } = await client.query(`
        select p.id, p.title, p.description, p.price, s.count
        from products as p
        inner join stocks as s
        on s.id = p.id;`);

    if (products.length === 0) {
      throw customError('Products not found', 404);
    }

    return successfulResponse(products);
  } catch (e) {
    return badResponse(e);
  } finally {
    await client.end();
  }
};
