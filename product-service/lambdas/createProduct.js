import { successfulResponse, badResponse } from '../helpers/responses.js';
import { logIncomingRequest, validateProductData } from '../helpers/utils';
import { getPostgresClient } from '../helpers/db';

export const createProduct = async (event) => {
  logIncomingRequest(event);

  const client = await getPostgresClient();

  try {
    const product = JSON.parse(event.body);
    validateProductData(product);
    const { title, description, price, count } = product;

    const [, insert] = await client.query(`
      begin transaction;
        with newProduct as (
            insert into products(title, description, price) values ('${title}', '${description}', '${price}')
            returning id
        )
        insert into stocks (id, count)
        select newProduct.id, numeric '${count}'
        from newProduct
        returning id;
      commit;
    `);

    return successfulResponse({ message: `product with id: ${insert.rows[0].id} successfully created` });
  } catch (e) {
    return badResponse(e);
  } finally {
    await client.end();
  }
};
