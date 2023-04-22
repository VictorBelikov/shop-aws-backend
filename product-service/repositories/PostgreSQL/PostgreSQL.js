import { getPostgresClient } from './helpers/getPostgresClient';
import { validateProductData } from '../../utils/validateProductData';
import { STATUS_CODE } from '../../constants/statusCode';
import { CustomError } from '../../utils/customError';

export const PostgreSQL = async () => {
  const postgresClient = await getPostgresClient();

  const getAll = async () => {
    const { rows: products } = await postgresClient.query(`
        select p.id, p.title, p.description, p.price, s.count
        from products as p
        inner join stocks as s
        on s.id = p.id;`);

    if (products.length === 0) {
      throw CustomError('Products not found', STATUS_CODE.NOT_FOUND);
    }

    return products;
  };

  const getById = async (id) => {
    const {
      rows: [product],
    } = await postgresClient.query(`
        select p.id, p.title, p.description, p.price, s.count
        from products as p
        inner join stocks as s
        on p.id = s.id
        where p.id = '${id}';`);

    if (!product) {
      throw CustomError('Product not found', STATUS_CODE.NOT_FOUND);
    }

    return product;
  };

  const create = async (product) => {
    validateProductData(product);
    const { title, description, price, count } = product;

    const [, insert] = await postgresClient.query(`
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

    return insert.rows[0].id;
  };
};
