import { successfulResponse, badResponse } from '../helpers/responses.js';
import { customError } from '../helpers/errorService.js';
import { logIncomingRequest } from '../helpers/utils';
import { getPostgresClient } from '../helpers/db';
import { STATUS_CODE } from '../constants/statusCode';

export const getProductById = async (event) => {
  logIncomingRequest(event);

  const client = await getPostgresClient();

  try {
    const { productId } = event.pathParameters;

    const {
      rows: [product],
    } = await client.query(`
        select p.id, p.title, p.description, p.price, s.count
        from products as p
        inner join stocks as s
        on p.id = s.id
        where p.id = '${productId}';`);

    if (!product) {
      throw customError('Product not found', STATUS_CODE.NOT_FOUND);
    }

    return successfulResponse(product);
  } catch (e) {
    return badResponse(e);
  } finally {
    await client.end();
  }
};
